<template>
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__brand">
        <CLinkTag
          class="footer__logo"
          link="/"
          :aria-label="$t('to_main', 'На головну')"
        >
          <CIcon v-if="logo" :raw="logo" />
        </CLinkTag>

        <UiTextLink
          v-if="downloadLink"
          class="footer__presentation"
          :link="downloadLink"
          target="_blank"
          :aria-label="
            $t('download_presentation_aria', 'Завантажити презентацію компанії')
          "
        >
          <CIcon name="footer/download" />

          <span class="s1-s-d">
            {{
              $t(
                'download_presentation_pdf',
                'Завантажити презентацію компанії (PDF)',
              )
            }}
          </span>
        </UiTextLink>
      </div>

      <nav
        v-if="navigation.length"
        class="footer__navigation"
        :aria-label="$t('footer_nav_aria', 'Навігація у футері')"
      >
        <h2 class="footer__heading h3-s-d">
          {{ $t('navigation', 'Навігація') }}:
        </h2>

        <LLanguageSwitch class="footer__languages" />

        <UiMenuItem
          v-for="item in navigation"
          :key="item.text"
          class="footer__navigation-link"
          :text="item.text"
          :link="item.link"
          text-class="h5-s-d"
        />
      </nav>

      <section
        v-if="contacts.length || socials.length"
        class="footer__contacts"
      >
        <h2 class="footer__heading h3-s-d">
          {{ $t('contacts', 'Контакти') }}:
        </h2>

        <UiContact
          v-for="contact in contacts"
          :key="contact.id"
          class="footer__contact"
          :title="contact.title"
          :link="contact.link"
          :icon="contact.icon"
          text-class="s1-r-d"
        />

        <div v-if="socials.length" class="footer__socials">
          <UiSocial
            v-for="social in socials"
            :key="social.id"
            :link="social.link"
            :icon="social.icon"
          />
        </div>
      </section>

      <p v-if="copyright" class="footer__copyright">
        <span class="s3-r-d">{{ $tp(copyright) }}</span>
      </p>

      <CLinkTag
        v-if="developerImage && developer.link"
        class="footer__developer"
        :link="developer.link"
        :aria-label="
          developer.image?.alternativeText ||
          $t('site_developer', 'Розробник сайту')
        "
      >
        <CImage :image="developerImage" />
      </CLinkTag>
    </div>
  </footer>
</template>

<script setup>
import { adaptedImage } from '@/adapters/image';
import { adaptedMenuLinks } from '@/adapters/menuLinks';

const props = defineProps({
  logo: {
    type: String,
    default: '',
  },
  links: {
    type: Array,
    default: () => [],
  },
  download: {
    type: Object,
    default: () => ({}),
  },
  developer: {
    type: Object,
    default: () => ({}),
  },
  contacts: {
    type: Array,
    default: () => [],
  },
  socials: {
    type: Array,
    default: () => [],
  },
  copyright: {
    type: String,
    default: '',
  },
});
const {
  public: { serverUrl },
} = useRuntimeConfig();

const navigation = computed(() => adaptedMenuLinks(props.links));
const developerImage = computed(() =>
  adaptedImage(props.developer?.image, serverUrl),
);
const downloadLink = computed(() =>
  props.download?.url
    ? new URL(props.download.url, serverUrl).toString()
    : false,
);
</script>

<style scoped lang="scss">
.footer {
  color: $color-white;
  background: $background-color-secondary;
  border-radius: em(10) em(10) 0 0;

  &__inner {
    display: grid;
    grid-template-areas:
      'brand navigation contacts'
      'developer navigation copyright';
    grid-template-columns: 1fr auto 1fr;
    grid-template-rows: 1fr auto;
    row-gap: em(35);
    width: 100%;
    max-width: em(1440);
    padding: em(80) em(50) em(50);
    margin-inline: auto;

    @include media-breakpoint-down(md) {
      grid-template-areas: 'brand' 'navigation' 'contacts' 'copyright' 'developer';
      grid-template-columns: 100%;
      grid-template-rows: none;
      justify-items: center;
      row-gap: em(45);
      padding: em(80) em(20) em(100);
    }

    @include media-breakpoint-between(sm, md) {
      grid-template-areas:
        'brand brand'
        'navigation contacts'
        'copyright copyright'
        'developer developer';
      grid-template-columns: 1fr 1fr;
      padding-inline: em(50);
    }
  }

  &__brand {
    grid-area: brand;
    justify-self: start;
    width: em(313);

    @include media-breakpoint-down(md) {
      justify-self: center;
      width: em(270);
    }

    @include media-breakpoint-between(sm, md) {
      width: max-content;
    }
  }

  &__logo {
    display: block;
    width: em(268);
    height: em(111);

    @include media-breakpoint-down(md) {
      width: em(171.29);
      height: em(70);
      margin: 0 auto;
    }
  }

  &__presentation {
    display: flex;
    gap: em(15);
    align-items: center;
    margin-top: em(28);

    @include media-breakpoint-down(md) {
      justify-content: center;
      margin-top: em(20);
    }

    :deep(svg) {
      flex: 0 0 em(22);
      width: em(22);
      height: em(22);
      color: $icon-color-accent;
    }
  }

  &__navigation {
    grid-area: navigation;
    display: flex;
    flex-direction: column;
    gap: em(15);
    align-self: start;
    width: em(198);
    margin-top: em(23);

    @include media-breakpoint-down(md) {
      align-items: center;
      width: em(228);
      margin-top: 0;
      text-align: center;
    }

    @include media-breakpoint-between(sm, md) {
      justify-self: start;
      align-items: flex-start;
      text-align: start;
    }
  }

  &__languages {
    position: static;
    display: flex;
    color: $color-white;
  }

  &__contacts {
    grid-area: contacts;
    justify-self: end;
    display: flex;
    flex-direction: column;
    gap: em(15);
    align-self: start;
    width: em(307);
    margin-top: em(23);
    margin-inline-end: em(35);

    @include media-breakpoint-down(md) {
      justify-self: center;
      align-items: center;
      width: auto;
      margin-top: 0;
      margin-inline-end: 0;
    }

    @include media-breakpoint-between(sm, md) {
      justify-self: end;
      align-items: flex-start;
    }
  }

  &__contact {
    display: flex;
    gap: em(15);
    align-items: center;

    :deep(svg) {
      flex: 0 0 em(22);
      width: em(22);
      height: em(22);
      color: $icon-color-accent;
      object-fit: contain;
    }
  }

  &__socials {
    display: flex;
    gap: em(20);
    align-items: center;

    :deep(svg) {
      width: em(35);
      height: em(35);
      color: $icon-color-accent;
    }
  }

  &__copyright {
    grid-area: copyright;
    justify-self: end;
    align-self: center;
    width: em(268);
    margin-inline-end: em(74);

    @include media-breakpoint-down(md) {
      justify-self: center;
      width: em(267);
      margin-inline-end: 0;
      text-align: center;
    }
  }

  &__developer {
    grid-area: developer;
    justify-self: start;
    align-self: center;
    width: em(70);
    height: em(70);
    overflow: hidden;
    border-radius: 50%;
    transition: opacity $time-normal ease;

    @include hover {
      opacity: 0.75;
    }

    @include media-breakpoint-down(md) {
      justify-self: center;
    }

    :deep(img) {
      width: 100%;
      height: 100%;
    }
  }

  &__heading {
    text-transform: uppercase;

    @include media-breakpoint-down(md) {
      text-align: center;
    }

    @include media-breakpoint-between(sm, md) {
      text-align: start;
    }
  }
}
</style>
