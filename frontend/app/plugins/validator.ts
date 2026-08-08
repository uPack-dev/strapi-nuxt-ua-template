import { AsYouType, getExampleNumber } from 'libphonenumber-js/mobile';
import type { CountryCode } from 'libphonenumber-js';
import examples from 'libphonenumber-js/mobile/examples';
import { defineRule, configure } from 'vee-validate';

/**
 * @returns Nuxt plugin registering validation rules and variable updates.
 * @example useNuxtApp().$validationPlugin.updateVariables('+49', 'DE')
 */
export default defineNuxtPlugin((nuxtApp) => {
  const validationState = useState('validationState', () => ({
    dialCode: '+38',
    iso2: 'UA' as CountryCode,
  }));

  configure({
    validateOnInput: true,
  });

  defineRule('required', (value: any) => {
    if (!value || value.length === 0) {
      return 'Це поле обовʼязкове';
    }
    return true;
  });

  defineRule('requiredCheckbox', (value: any) => {
    if (value !== true) {
      return 'Потрібно погодитися з умовами';
    }
    return true;
  });

  defineRule('phone', (value: any) => {
    if (!value) {
      return 'Введіть номер телефону';
    }
    const { iso2, dialCode } = validationState.value;
    const example = getExampleNumber(iso2, examples);
    const phone = new AsYouType(iso2).input(example!.number);
    const dialCodeMask = dialCode;
    const phoneNumbers = phone.replace(dialCodeMask, '').replace(/[0-9]/g, '0');

    if (`${dialCodeMask}${phoneNumbers}`.length > value.length) {
      return 'Номер телефону надто короткий';
    }
    return true;
  });

  defineRule('email', (value: any) => {
    if (!value) {
      return 'Введіть адресу електронної пошти';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Введіть коректну адресу електронної пошти';
    }
    return true;
  });

  defineRule('min', (value: any, [limit]: [number]) => {
    if (!value || value.length < limit) {
      return `Мінімальна довжина — ${limit} символів`;
    }
    return true;
  });

  defineRule('max', (value: any, [limit]: [number]) => {
    if (value && value.length > limit) {
      return `Максимальна довжина — ${limit} символів`;
    }
    return true;
  });

  defineRule('alpha', (value: any) => {
    if (!value) return true;
    const alphaRegex = /^[a-zA-Zа-яА-Я]+$/;
    if (!alphaRegex.test(value)) {
      return 'Це поле має містити лише літери';
    }
    return true;
  });

  defineRule('alpha_spaces', (value: any) => {
    if (!value) return true;
    const alphaSpacesRegex = /^[a-zA-Zа-яА-Я\s]+$/;
    if (!alphaSpacesRegex.test(value)) {
      return 'Це поле має містити лише літери та пробіли';
    }
    return true;
  });

  defineRule('alpha_num', (value: any) => {
    if (!value) return true;
    const alphaNumRegex = /^[a-zA-Zа-яА-Я0-9]+$/;
    if (!alphaNumRegex.test(value)) {
      return 'Це поле має містити лише літери та цифри';
    }
    return true;
  });

  defineRule('length', (value: any, [exactLength]: [string]) => {
    if (!value) {
      return `Це поле має містити рівно ${exactLength} символів`;
    }
    if (value.length !== parseInt(exactLength)) {
      return `Це поле має містити рівно ${exactLength} символів`;
    }
    return true;
  });

  defineRule('digits', (value: any) => {
    if (!value) return true;
    const digitsRegex = /^\d+$/;
    if (!digitsRegex.test(value)) {
      return 'Це поле має містити лише цифри';
    }
    return true;
  });

  defineRule('url', (value: any) => {
    if (!value) return true;
    const urlRegex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(:\d{1,5})?(\/\S*)?$/i;
    if (!urlRegex.test(value)) {
      return 'Введіть коректний URL';
    }
    return true;
  });

  nuxtApp.provide('validationPlugin', {
    updateVariables(dialCodeNew: string, iso2New: CountryCode) {
      validationState.value = { dialCode: dialCodeNew, iso2: iso2New };
    },
  });
});
