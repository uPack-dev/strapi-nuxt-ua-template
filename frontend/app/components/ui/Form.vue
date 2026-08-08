<template>
  <div class="ui-form">
    <div v-if="displayTitle || displayDescription" class="ui-form__info">
      <h2 v-if="displayTitle" class="ui-form__title">
        <span :class="titleClass">{{ $tp(displayTitle) }}</span>
      </h2>

      <p v-if="displayDescription" class="ui-form__description">
        <span class="s2-r-d">{{ $tp(formattedDescription) }}</span>
      </p>
    </div>

    <VeeForm v-slot="{ meta }" class="ui-form__form" @submit="onSubmit">
      <div class="ui-form__column">
        <UiInput
          name="name"
          :label="$t('your_name', 'Ваше ім’я')"
          :placeholder="$t('name_placeholder', 'Іван')"
          rules="required"
        />

        <UiInput
          name="company"
          :label="$t('company', 'Компанія')"
          :placeholder="$t('name_placeholder', 'Іван')"
        />

        <UiInput
          name="phone"
          type="tel"
          :label="$t('your_phone', 'Ваш номер телефону')"
          placeholder="+38(097)777 7777"
          mask="+38(0##)### ####"
          rules="required|phone"
        />
      </div>

      <div class="ui-form__column">
        <UiInput
          name="email"
          type="email"
          :label="$t('your_email', 'Ваш Email')"
          placeholder="example@gmail.com"
          rules="required|email"
        />

        <UiInput
          name="comment"
          :label="$t('comment_label', 'Коментар / запит')"
          :placeholder="$t('comment_placeholder', 'Укажіть деталі')"
        />

        <UiButton
          class="ui-form__submit"
          type="submit"
          :disabled="!meta.valid || isLoading"
        >
          {{ $t('send_request') }}
        </UiButton>
      </div>
    </VeeForm>
  </div>
</template>

<script setup>
import { useModal } from 'vue-final-modal';

defineOptions({
  name: 'UiForm',
});

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  titleSize: {
    type: String,
    default: 'lg',
    validator: (value) => ['md', 'lg'].includes(value),
  },
  requestContext: {
    type: Object,
    default: () => ({}),
  },
  requestData: {
    type: Object,
    default: () => ({}),
  },
});

const titleClass = computed(() =>
  props.titleSize === 'md' ? 'd2-s-d' : 'd1-s-d',
);

const emit = defineEmits(['success']);
const { $t } = useNuxtApp();
const displayTitle = computed(
  () => props.title || $t('form_title', 'Зв’яжіться з нами'),
);
const displayDescription = computed(
  () =>
    props.description ||
    $t(
      'form_description',
      'Маєте питання або потребу у підборі обладнання? Зв’яжіться з нами, і наша команда із задоволенням надасть необхідну інформацію.',
    ),
);
const globalStore = useGlobalStore();
const isLoading = ref(false);
const formattedDescription = computed(() =>
  displayDescription.value.replace(/ *\u2028 */g, '\n'),
);
const statusModal = useModal({
  component: resolveComponent('LazyModalsStatus'),
});

async function onSubmit(values) {
  isLoading.value = true;

  try {
    const context = Object.entries(props.requestContext)
      .filter(([, value]) => value)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    await globalStore.sendLead({
      ...values,
      ...props.requestData,
      comment: [values.comment, context].filter(Boolean).join('\n\n'),
    });
    emit('success');
    statusModal.patchOptions({
      attrs: {
        title: $t('form_success_title', 'Дякуємо за звернення!'),
        description: $t(
          'form_success_text',
          'Ми зв’яжемося з вами найближчим часом.',
        ),
      },
    });
  } catch {
    statusModal.patchOptions({
      attrs: {
        title: $t('form_error_title', 'Не вдалося відправити запит'),
        description: $t(
          'form_error_text',
          'Спробуйте ще раз або зв’яжіться з нами телефоном.',
        ),
      },
    });
  } finally {
    isLoading.value = false;
  }

  await statusModal.open();
}
</script>

<style scoped lang="scss">
.ui-form {
  color: $color-navy;

  &__info {
    display: flex;
    flex-direction: column;
    gap: em(20);
    margin-block-end: em(30);

    @include media-breakpoint-down(md) {
      margin-block-end: em(20);
    }
  }

  &__title {
    text-transform: uppercase;
  }

  &__description {
    @include media-breakpoint-up(md) {
      white-space: pre-line;
    }
  }

  &__form {
    display: flex;
    gap: em(29);

    @include media-breakpoint-down(md) {
      flex-direction: column;
      gap: em(10);
    }
  }

  &__column {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: em(10);

    @include media-breakpoint-down(md) {
      gap: em(10);
    }
  }

  &__submit {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-block-start: auto;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }

    @include media-breakpoint-down(md) {
      margin-block-start: em(10);
    }
  }
}
</style>
