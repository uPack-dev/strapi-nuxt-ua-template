<template>
  <div class="error-wrapper">
    <div class="error-wrapper__content container">
      <div class="error-wrapper__title">
        <p class="d1-s-d">{{ status.code }}</p>
      </div>

      <div
        v-if="status.title"
        class="error-wrapper__row error-wrapper__subtitle"
      >
        <h1 class="h2-s-d">{{ $tp(status.title) }}</h1>
      </div>

      <div class="error-wrapper__row error-wrapper__description">
        <p class="s2-r-d">{{ $tp(status.message) }}</p>
      </div>

      <div v-if="isDev" class="error-wrapper__row error-wrapper__description">
        <p class="s2-l-d">{{ error }}</p>
      </div>

      <div class="error-wrapper__row error-wrapper__button">
        <UiButton class="error-wrapper__link" link="/">
          {{ $tp($t('to_main', 'На головну')) }}
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  error: {
    type: Object,
    required: true,
  },
  clearError: {
    type: Function,
    default: () => {},
  },
});

const {
  public: { isDev },
} = useRuntimeConfig();

const route = useRoute();
const { $t } = useNuxtApp();

const statusMessages = {
  403: {
    code: 403,
    title: $t('error_403_title', 'Доступ заборонено'),
    message: $t(
      'error_403_text',
      'У вас немає дозволу переглядати цю сторінку. Спробуйте інший обліковий запис або поверніться на головну.',
    ),
  },
  404: {
    code: 404,
    title: $t('error_404_title', 'Сторінку не знайдено'),
    message: $t(
      'error_404_text',
      'Схоже, це посилання нікуди не веде. Перевірте адресу або почніть із головної сторінки.',
    ),
  },
  500: {
    code: 500,
    title: '',
    message: $t(
      'error_500_text',
      'На нашому боці сталася помилка. Ми вже працюємо над цим — будь ласка, оновіть сторінку.',
    ),
  },
};

const status = computed(() => {
  const statusCode = props.error.status || props.error.statusCode;
  const code = Object.keys(statusMessages)
    .map((key) => parseInt(key))
    .includes(statusCode)
    ? statusCode
    : 404;
  return statusMessages[code];
});

onMounted(() => window.scrollTo(0, 0));

const stopWatcher = watch(
  route,
  () => {
    props.clearError();
  },
  { deep: true },
);

onBeforeUnmount(() => {
  stopWatcher();
});
</script>

<style scoped lang="scss">
.error-wrapper {
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  padding: em(180) 0 em(100);
  color: $text-color-secondary;
  background: $background-color-secondary;

  @include media-breakpoint-down(md) {
    padding: em(120) 0 em(70);
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: em(20);
    justify-content: center;

    @include media-breakpoint-down(md) {
      align-items: center;
      text-align: center;
    }
  }

  &__title {
    color: $text-color-accent;
  }

  &__subtitle {
    max-width: em(720);
    text-transform: uppercase;
  }

  &__description {
    max-width: em(680);
  }

  &__button {
    margin-top: em(10);
  }

  &__link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: em(57);
    padding: 0 em(40);
    text-decoration: none;

    @include media-breakpoint-down(md) {
      min-height: em(47);
      padding: 0 em(30);
    }
  }
}
</style>
