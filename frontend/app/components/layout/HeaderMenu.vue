<template>
  <AFade>
    <div
      v-if="active"
      class="header-menu header-menu--desktop hidden-mobile-tablet"
    >
      <div class="header-menu__inner">
        <div class="header-menu__contacts">
          <div v-if="contacts?.length" class="header-menu__info">
            <p class="header-menu__heading h5-s-d">
              {{ $t('contact_details', 'Контактні дані') }}:
            </p>

            <div class="header-menu__list">
              <UiContact
                v-for="contact in contacts"
                :key="contact.id"
                class="header-menu__contact"
                :class="
                  contact.icon === 'address' && 'header-menu__contact--address'
                "
                :title="contact.title"
                :link="contact.link"
                :icon="contact.icon"
                text-class="s1-r-d"
              />

              <div v-if="socials?.length" class="header-menu__socials">
                <UiSocial
                  v-for="social in socials"
                  :key="social.id"
                  :link="social.link"
                  :icon="social.icon"
                />
              </div>
            </div>
          </div>

          <div class="header-menu__actions">
            <UiButton
              class="header-menu__request"
              :action="BUTTON_ACTION.CALLBACK_MODAL"
              text-class="button-s-d"
            >
              {{ $t('send_request') }}
            </UiButton>

            <UiTextLink
              v-if="downloadLink"
              class="header-menu__presentation"
              :link="downloadLink"
              target="_blank"
              :aria-label="
                $t(
                  'download_presentation_aria',
                  'Завантажити презентацію компанії',
                )
              "
            >
              <CIcon name="footer/download" />

              <span class="s1-s-d">
                {{ $t('download_presentation', 'Завантажити презентацію') }}
              </span>
            </UiTextLink>
          </div>
        </div>

        <div v-if="previewImage" class="header-menu__preview">
          <CImage :image="previewImage" />
        </div>

        <nav
          class="header-menu__navigation"
          :aria-label="$t('main_menu_aria', 'Головне меню')"
        >
          <template v-for="item in navigation" :key="item.text">
            <UiMenuItem
              v-if="!item.links.length"
              class="header-menu__link"
              :text="item.text"
              :link="item.link"
              text-class="h5-s-d"
              @click="closeMenu"
            />

            <template v-else>
              <UiMenuItem
                class="header-menu__link header-menu__link--heading"
                :text="item.text"
                :link="item.link"
                text-class="h5-s-d"
                @click="closeMenu"
              />

              <div v-if="item.links.length" class="header-menu__submenu">
                <UiMenuItem
                  v-for="child in item.links"
                  :key="child.text"
                  class="header-menu__submenu-link"
                  :text="child.text"
                  :link="child.link"
                  icon="menu/arrow"
                  text-class="i2-r-d"
                  @click="closeMenu"
                />
              </div>
            </template>
          </template>
        </nav>
      </div>
    </div>
  </AFade>

  <AFade>
    <div v-if="active" class="header-menu header-menu--mobile hidden-desktop">
      <LLanguageSwitch class="header-menu__languages" />

      <nav
        class="header-menu__navigation"
        :aria-label="$t('main_menu_aria', 'Головне меню')"
      >
        <template v-for="item in navigation" :key="item.text">
          <UiMenuItem
            v-if="!item.links.length"
            class="header-menu__link"
            :text="item.text"
            :link="item.link"
            text-class="h6-s-d"
            @click="closeMenu"
          />

          <UiDropdown
            v-else
            class="header-menu__dropdown"
            :title="item.text"
            :is-active="openSection === item.text"
            @click="toggleSection(item.text)"
          >
            <div class="header-menu__submenu">
              <UiMenuItem
                v-for="child in item.links"
                :key="child.text"
                class="header-menu__submenu-link"
                :text="child.text"
                :link="child.link"
                icon="menu/arrow"
                text-class="i2-r-d"
                @click="closeMenu"
              />
            </div>
          </UiDropdown>
        </template>

        <UiDropdown
          class="header-menu__dropdown"
          :title="$t('contact_details', 'Контактні дані')"
          :is-active="openSection === 'contacts'"
          @click="toggleSection('contacts')"
        >
          <div class="header-menu__contacts">
            <UiContact
              v-for="contact in contacts"
              :key="contact.id"
              class="header-menu__contact"
              :class="
                contact.icon === 'address' && 'header-menu__contact--address'
              "
              :title="contact.title"
              :link="contact.link"
              :icon="contact.icon"
              text-class="s1-r-d"
            />

            <div v-if="socials?.length" class="header-menu__socials">
              <UiSocial
                v-for="social in socials"
                :key="social.id"
                :link="social.link"
                :icon="social.icon"
              />
            </div>
          </div>
        </UiDropdown>
      </nav>

      <div class="header-menu__actions">
        <UiButton
          class="header-menu__request"
          :action="BUTTON_ACTION.CALLBACK_MODAL"
          text-class="button-s-d"
        >
          {{ $t('send_request') }}
        </UiButton>

        <UiTextLink
          v-if="downloadLink"
          class="header-menu__presentation"
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
    </div>
  </AFade>
</template>

<script setup>
import { adaptedImage } from '@/adapters/image';
import { adaptedMenuLinks } from '@/adapters/menuLinks';
import { BUTTON_ACTION } from '@/configs/uiButtonOptions';

const props = defineProps({
  active: {
    type: Boolean,
    default: false,
  },
  links: {
    type: Array,
    default: () => [],
  },
  download: {
    type: Object,
    default: () => ({}),
  },
  image: {
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
});
const emit = defineEmits(['update:active']);

const route = useRoute();
const openSection = ref(null);
const scrollLock = useScrollLock();
const {
  public: { serverUrl },
} = useRuntimeConfig();

const previewImage = computed(() => adaptedImage(props.image, serverUrl));
const navigation = computed(() => adaptedMenuLinks(props.links));
const downloadLink = computed(() =>
  props.download?.url
    ? new URL(props.download.url, serverUrl).toString()
    : false,
);

const closeMenu = () => emit('update:active', false);
const toggleSection = (section) => {
  openSection.value = openSection.value === section ? null : section;
};

watch(
  () => props.active,
  (active) => {
    if (active) {
      scrollLock.lock();
    } else {
      openSection.value = null;
      scrollLock.unlock();
    }
  },
);
watch(() => route.fullPath, closeMenu);
onBeforeUnmount(scrollLock.unlock);
</script>

<style scoped lang="scss">
/* stylelint-disable selector-class-pattern -- deep selectors target child-owned BEM classes */
.header-menu {
  $parent: &;

  &__contact :deep(svg) {
    color: $icon-color-accent;
  }

  &--desktop {
    position: fixed;
    inset: 0;
    z-index: 1;
    overflow-y: auto;
    color: $color-white;
    background: $background-color-secondary;

    #{$parent}__inner {
      position: relative;
      width: 100%;
      max-width: em(1470);
      height: 100%;
      margin: 0 auto;
    }

    #{$parent}__contacts {
      position: absolute;
      inset-block-start: calc(50% + #{em(47)});
      inset-inline-start: em(50);
      display: flex;
      flex-direction: column;
      gap: em(40);
      width: em(382);
      transform: translateY(-50%);
    }

    #{$parent}__heading {
      text-transform: uppercase;
    }

    #{$parent}__info {
      display: flex;
      flex-direction: column;
      gap: em(20);
    }

    #{$parent}__list {
      display: flex;
      flex-direction: column;
      gap: em(15);

      :deep(svg) {
        flex: 0 0 em(22);
        width: em(22);
        height: em(22);
        object-fit: contain;
      }
    }

    #{$parent}__contact {
      display: flex;
      gap: em(15);
      align-items: center;

      :deep(.ui-contact__text) {
        flex: 1;
      }

      &--address {
        align-items: flex-start;
      }
    }

    #{$parent}__socials {
      display: flex;
      gap: em(20);

      :deep(svg) {
        width: em(25);
        height: em(25);
      }
    }

    #{$parent}__actions {
      display: flex;
      flex-direction: column;
      gap: em(15);
    }

    #{$parent}__request {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: em(57);
    }

    #{$parent}__presentation {
      display: flex;
      gap: em(15);
      align-items: center;

      :deep(svg) {
        flex: 0 0 em(22);
        width: em(22);
        height: em(22);
        color: $icon-color-accent;
      }
    }

    #{$parent}__preview {
      position: absolute;
      inset-block-start: calc(50% + #{em(47)});
      inset-inline-start: em(492);
      width: em(456);
      height: em(500);
      overflow: hidden;
      border-radius: em(10);
      transform: translateY(-50%);

      :deep(img) {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    #{$parent}__navigation {
      position: absolute;
      inset-block-start: calc(50% + #{em(47)});
      inset-inline-start: em(1008);
      display: flex;
      flex-direction: column;
      gap: em(20);
      width: em(382);
      transform: translateY(-50%);
    }

    #{$parent}__link {
      text-align: start;
      text-transform: uppercase;
    }

    #{$parent}__submenu {
      display: flex;
      flex-direction: column;
      gap: em(15);

      :deep(svg) {
        flex: 0 0 em(31);
        width: em(31);
        height: em(22);
        color: $icon-color-accent;
      }
    }

    #{$parent}__submenu-link {
      display: flex;
      gap: em(9);
      align-items: flex-start;
      width: 100%;

      :deep(.ui-menu-item__text) {
        flex: 1;
      }
    }
  }

  &--mobile {
    @include scrollbar;

    position: fixed;
    inset: em(70) 0 0;
    display: flex;
    flex-direction: column;
    gap: em(30);
    align-items: center;
    padding: em(50) 0 em(40);
    overflow-y: auto;
    scrollbar-gutter: stable both-edges;
    color: $color-white;
    background: $background-color-secondary;

    #{$parent}__languages,
    #{$parent}__navigation,
    #{$parent}__actions {
      flex-shrink: 0;
    }

    #{$parent}__languages {
      position: static;
      margin-block-start: auto;
      color: $color-white;
    }

    #{$parent}__navigation {
      display: flex;
      flex-direction: column;
      gap: em(30);
      align-items: center;
      width: em(320);
    }

    #{$parent}__link {
      display: flex;
      gap: em(10);
      align-items: center;
      justify-content: center;
      text-align: center;
      text-transform: uppercase;

      &--active {
        color: $text-color-accent;
      }
    }

    #{$parent}__submenu {
      display: flex;
      flex-direction: column;
      gap: em(7);
      align-items: center;
      width: em(320);
      padding-block-start: em(25);

      :deep(svg) {
        flex: 0 0 em(31);
        width: em(31);
        height: em(22);
        color: $icon-color-accent;
      }
    }

    #{$parent}__submenu-link {
      display: flex;
      gap: em(9);
      align-items: center;
      justify-content: center;
      width: 100%;
      min-height: em(22);
      text-align: center;

      &:first-child {
        max-width: em(271);

        :deep(.ui-menu-item__text) {
          white-space: normal;
        }
      }

      :deep(.ui-menu-item__text) {
        white-space: nowrap;
      }
    }

    #{$parent}__contacts {
      display: flex;
      flex-direction: column;
      gap: em(7);
      align-items: center;
      width: em(318);
      padding-block: em(15) em(20);

      :deep(svg) {
        flex: 0 0 em(20);
        width: em(20);
        height: em(20);
        object-fit: contain;
      }
    }

    #{$parent}__contact {
      display: flex;
      gap: em(10);
      align-items: center;
      justify-content: center;

      &--address {
        align-items: flex-start;
        max-width: em(310);
        text-align: center;

        :deep(.ui-contact__text) {
          flex: 1;
        }
      }
    }

    #{$parent}__socials {
      display: flex;
      gap: em(20);
      margin-top: em(8);

      :deep(svg) {
        width: em(25);
        height: em(25);
      }
    }

    #{$parent}__actions {
      display: flex;
      flex-direction: column;
      gap: em(15);
      align-items: center;
      width: em(320);
      margin-block-start: auto;
    }

    #{$parent}__request {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: em(47);
    }

    #{$parent}__presentation {
      display: flex;
      gap: em(15);
      align-items: center;
      justify-content: center;
      text-align: center;

      :deep(svg) {
        width: em(22);
        height: em(22);
        color: $icon-color-accent;
      }
    }
  }
}
</style>
