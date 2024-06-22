/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  darkMode: "class",

  theme: {
    extend: {
      backgroundImage: {
        'HeroImageLight': "url('../public/heroImageLight.png')",
        'HeroImageDark': "url('../public/heroImageDark.png')",
        'AvatarsImage': "url(../public/AvatarsImage.png)",
      },

      fontFamily: {
        notoSansDisplay: ['Noto Sans Display'],
      },

      fontSize: {
        'DisplayLarge': ['3.5rem', {
          lineHeight: '62.2px',
          letterSpacing: '0.34px',
          fontWeight: '600',
        }],

        'HeadlineSmall': ['1.225rem', {
          lineHeight: '1.75rem',
          letterSpacing: '0.12px',
          fontWeight: '500',
        }],

        'TitleLarge': ['1.375rem', {
          lineHeight: '2rem',
          letterSpacing: '0.07px',
          fontWeight: '400',
        }],
        'TitleMedium': ['0.875rem', {
          lineHeight: '1.25rem',
          letterSpacing: '-0.16px',
          fontWeight: '500',
        }],
        'TitleSmall': ['0.675rem', {
          lineHeight: '0.875rem',
          letterSpacing: '0.12px',
          fontWeight: '500',
        }],

        'LabelLarge': ['0.975rem', {
          lineHeight: '1.375rem',
          letterSpacing: '0.12px',
          fontWeight: '400',
        }],
        'LabelLargeProminent': ['0.975rem', {
          lineHeight: '1.375rem',
          letterSpacing: '0.12px',
          fontWeight: '600',
        }],
        'LabelMedium': ['0.85rem', {
          lineHeight: '1.25rem',
          letterSpacing: '0.2px',
          fontWeight: '400',
        }],
        'LabelMediumProminent': ['0.85rem', {
          lineHeight: '1.25rem',
          letterSpacing: '0.2px',
          fontWeight: '600',
        }],
        'LabelSmall': ['0.675rem', {
          lineHeight: '1rem',
          letterSpacing: '0.2px',
          fontWeight: '400',
        }],
        'LabelSmallProminent': ['0.675rem', {
          lineHeight: '1rem',
          letterSpacing: '0.16px',
          fontWeight: '600',
        }],

        'BodyLarge': ['1rem', {
          lineHeight: '1.375rem',
          letterSpacing: '0.28px',
          fontWeight: '400',
        }],
        'BodyMedium': ['0.875rem', {
          lineHeight: '1.25rem',
          letterSpacing: '0px',
          fontWeight: '400',
        }],
        'BodySmall': ['0.7rem', {
          lineHeight: '1rem',
          letterSpacing: '0.32px',
          fontWeight: '400',
        }],
      },

      boxShadow: {
        'Elevation01-Light dark:shadow-Elevation01-Dark': '0 1px 2px rgba(20, 20, 20, 0.14), 0 0 2px rgba(20, 20, 20, 0.12)',
        'Elevation01-Dark': '0 1px 2px rgba(20, 20, 20, 0.40), 0 0 2px rgba(20, 20, 20, 0.36)',

        'Elevation02-Light': '0 2px 4px rgba(20, 20, 20, 0.14), 0 0 2px rgba(20, 20, 20, 0.12)',
        'Elevation02-Dark': '0 2px 4px rgba(20, 20, 20, 0.40), 0 0 2px rgba(20, 20, 20, 0.36)',

        'Elevation03-Light': '0 4px 12px rgba(20, 20, 20, 0.14), 0 0 4px rgba(20, 20, 20, 0.12)',
        'Elevation03-Dark': '0 4px 12px rgba(20, 20, 20, 0.40), 0 0 4px rgba(20, 20, 20, 0.36)',

        'Elevation04-Light': '0 8px 16px rgba(20, 20, 20, 0.14), 0 0 4px rgba(20, 20, 20, 0.12)',
        'Elevation04-Dark': '0 8px 16px rgba(20, 20, 20, 0.40), 0 0 4px rgba(20, 20, 20, 0.36)',

        'Elevation05-Light': '0 16px 30px rgba(20, 20, 20, 0.14), 0 0 6px rgba(20, 20, 20, 0.12)',
        'Elevation05-Dark': '0 16px 30px rgba(20, 20, 20, 0.40), 0 0 6px rgba(20, 20, 20, 0.36)',

        'Elevation06-Light': '0 32px 36px rgba(20, 20, 20, 0.14), 0 0 6px rgba(20, 20, 20, 0.12)',
        'Elevation06-Dark': '0 32px 36px rgba(20, 20, 20, 0.40), 0 0 6px rgba(20, 20, 20, 0.36)',
      },

      colors: {
        'Neutral': {
          'Background': {
            1: {
              'Rest': 'rgb(var(--Neutral-Background-1-Rest))',
              'Hover': 'rgb(var(--Neutral-Background-1-Hover))',
              'Pressed': 'rgb(var(--Neutral-Background-1-Pressed))',
              'Selected': 'rgb(var(--Neutral-Background-1-Selected))',
            },
            2: {
              'Rest': 'rgb(var(--Neutral-Background-2-Rest))',
              'Hover': 'rgb(var(--Neutral-Background-2-Hover))',
              'Pressed': 'rgb(var(--Neutral-Background-2-Pressed))',
              'Selected': 'rgb(var(--Neutral-Background-2-Selected))',
            },
            3: {
              'Rest': 'rgb(var(--Neutral-Background-3-Rest))',
              'Hover': 'rgb(var(--Neutral-Background-3-Hover))',
              'Pressed': 'rgb(var(--Neutral-Background-3-Pressed))',
              'Selected': 'rgb(var(--Neutral-Background-3-Selected))',
            },
            4: {
              'Rest': 'rgb(var(--Neutral-Background-4-Rest))',
              'Hover': 'rgb(var(--Neutral-Background-4-Hover))',
              'Pressed': 'rgb(var(--Neutral-Background-4-Pressed))',
              'Selected': 'rgb(var(--Neutral-Background-4-Selected))',
            },
            5: {
              'Rest': 'rgb(var(--Neutral-Background-5-Rest))',
              'Hover': 'rgb(var(--Neutral-Background-5-Hover))',
              'Pressed': 'rgb(var(--Neutral-Background-5-Pressed))',
              'Selected': 'rgb(var(--Neutral-Background-5-Selected))',
            },
            'Disabled': {
              1: {
                'Rest': 'rgb(var(--Neutral-Background-Disabled-1-Rest))',
              },

              2: {
                'Rest': 'rgb(var(--Neutral-Background-Disabled-2-Rest))',
              },
            },
            'Subtle': {
              'Rest': 'rgb(var(--Neutral-Background-Subtle-Rest))',
              'Hover': 'rgb(var(--Neutral-Background-Subtle-Hover))',
              'Pressed': 'rgb(var(--Neutral-Background-Subtle-Pressed))',
              'Selected': 'rgb(var(--Neutral-Background-Subtle-Selected))',
            },
            'Overlay': {
              'Rest': 'rgb(var(--Neutral-Background-Overlay-Rest))',
            },
          },

          'Foreground': {
            1: {
              'Rest': 'rgb(var(--Neutral-Foreground-1-Rest))',
              'Hover': 'rgb(var(--Neutral-Foreground-1-Hover))',
              'Pressed': 'rgb(var(--Neutral-Foreground-1-Pressed))',
              'Selected': 'rgb(var(--Neutral-Foreground-1-Selected))',
            },
            2: {
              'Rest': 'rgb(var(--Neutral-Foreground-2-Rest))',
              'Hover': 'rgb(var(--Neutral-Foreground-2-Hover))',
              'Pressed': 'rgb(var(--Neutral-Foreground-2-Pressed))',
              'Selected': 'rgb(var(--Neutral-Foreground-2-Selected))',
            },
            3: {
              'Rest': 'rgb(var(--Neutral-Foreground-3-Rest))',
              'Hover': 'rgb(var(--Neutral-Foreground-3-Hover))',
              'Pressed': 'rgb(var(--Neutral-Foreground-3-Pressed))',
              'Selected': 'rgb(var(--Neutral-Foreground-3-Selected))',
            },
            4: {
              'Rest': 'rgb(var(--Neutral-Foreground-4-Rest))',
              'Hover': 'rgb(var(--Neutral-Foreground-4-Hover))',
              'Pressed': 'rgb(var(--Neutral-Foreground-4-Pressed))',
              'Selected': 'rgb(var(--Neutral-Foreground-4-Selected))',
            },
            5: {
              'Rest': 'rgb(var(--Neutral-Foreground-5-Rest))',
              'Hover': 'rgb(var(--Neutral-Foreground-5-Hover))',
              'Pressed': 'rgb(var(--Neutral-Foreground-5-Pressed))',
              'Selected': 'rgb(var(--Neutral-Foreground-5-Selected))',
            },

            'Disabled': {
              'Rest': 'rgb(var(--Neutral-Foreground-Disabled-Rest))',
              'Variant': 'rgb(var(--Neutral-Foreground-Disabled-Variant))',

              'OnPrimary': {
                'Rest': 'rgb(var(--Neutral-Foreground-Disabled-onPrimary-Rest))',
                'Variant': 'rgb(var(--Neutral-Foreground-Disabled-onPrimary-Variant))',
              }
            },

            'Variant': {
              'Rest': 'rgb(var(--Neutral-Foreground-Variant-Rest))',
              'Hover': 'rgb(var(--Neutral-Foreground-Variant-Hover))',
              'Pressed': 'rgb(var(--Neutral-Foreground-Variant-Pressed))',
              'Selected': 'rgb(var(--Neutral-Foreground-Variant-Selected))',
            },

            'OnPrimary': {
              'Rest': 'rgb(var(--Neutral-Foreground-OnPrimary-Rest))',
              'Variant': 'rgb(var(--Neutral-Foreground-OnPrimary-Variant))',
            },
          },

          'Stroke': {
            1: {
              'Rest': 'rgb(var(--Neutral-Stroke-1-Rest))',
              'Hover': 'rgb(var(--Neutral-Stroke-1-Hover))',
              'Pressed': 'rgb(var(--Neutral-Stroke-1-Pressed))',
              'Selected': 'rgb(var(--Neutral-Stroke-1-Selected))',
            },

            2: {
              'Rest': 'rgb(var(--Neutral-Stroke-2-Rest))',
              'Hover': 'rgb(var(--Neutral-Stroke-2-Hover))',
              'Pressed': 'rgb(var(--Neutral-Stroke-2-Pressed))',
              'Selected': 'rgb(var(--Neutral-Stroke-2-Selected))',
            },

            'Accessible': {
              'Rest': 'rgb(var(--Neutral-Stroke-Accessible-Rest))',
              'Hover': 'rgb(var(--Neutral-Stroke-Accessible-Hover))',
              'Pressed': 'rgb(var(--Neutral-Stroke-Accessible-Pressed))',
              'Selected': 'rgb(var(--Neutral-Stroke-Accessible-Selected))',
            },

            'Disabled': {
              'Rest': 'rgb(var(--Neutral-Stroke-Disabled-Rest))',
            },
          },
        },

        'Primary': {
          'Background': {
            1: {
              'Rest': 'rgb(var(--Primary-Background-1-Rest))',
              'Hover': 'rgb(var(--Primary-Background-1-Hover))',
              'Pressed': 'rgb(var(--Primary-Background-1-Pressed))',
              'Selected': 'rgb(var(--Primary-Background-1-Selected))',
            },

            2: {
              'Rest': 'rgb(var(--Primary-Background-2-Rest))',
              'Hover': 'rgb(var(--Primary-Background-2-Hover))',
              'Pressed': 'rgb(var(--Primary-Background-2-Pressed))',
              'Selected': 'rgb(var(--Primary-Background-2-Selected))',
            },

            'Disabled': {
              'Rest': 'rgb(var(--Primary-Background-Disabled-Rest))',
            },

            'Compound': {
              'Rest': 'rgb(var(--Primary-Background-Compound-Rest))',
              'Hover': 'rgb(var(--Primary-Background-Compound-Hover))',
              'Pressed': 'rgb(var(--Primary-Background-Compound-Pressed))',
              'Selected': 'rgb(var(--Primary-Background-Compound-Selected))',
            },
            'Subtle': {
              'Rest': 'rgb(var(--Primary-Background-Subtle-Rest))',
              'Hover': 'rgb(var(--Primary-Background-Subtle-Hover))',
              'Pressed': 'rgb(var(--Primary-Background-Subtle-Pressed))',
              'Selected': 'rgb(var(--Primary-Background-Subtle-Selected))',
            },
          },

          'Foreground': {
            1: {
              'Rest': 'rgb(var(--Primary-Foreground-1-Rest))',
            },

            'Disabled': {
              'Rest': 'rgb(var(--Primary-Foreground-Disabled-Rest))',
              'Variant': 'rgb(var(--Primary-Foreground-Disabled-Variant))',
            },

            'Link': {
              'Rest': 'rgb(var(--Primary-Foreground-Link-Rest))',
              'Hover': 'rgb(var(--Primary-Foreground-Link-Hover))',
              'Pressed': 'rgb(var(--Primary-Foreground-Link-Pressed))',
              'Selected': 'rgb(var(--Primary-Foreground-Link-Selected))',
            },

            'Compound': {
              'Rest': 'rgb(var(--Primary-Foreground-Compound-Rest))',
              'Hover': 'rgb(var(--Primary-Foreground-Compound-Hover))',
              'Pressed': 'rgb(var(--Primary-Foreground-Compound-Pressed))',
              'Selected': 'rgb(var(--Primary-Foreground-Compound-Selected))',
            },
          },

          'Stroke': {
            1: {
              'Rest': 'rgb(var(--Primary-Stroke-1-Rest))'
            },

            'Disabled': {
              'Rest': 'rgb(var(--Primary-Stroke-Disabled-Rest))',
              'Variant': 'rgb(var(--Primary-Stroke-Disabled-Variant))',
            },
            'Compound': {
              'Rest': 'rgb(var(--Primary-Stroke-Compound-Rest))',
              'Hover': 'rgb(var(--Primary-Stroke-Compound-Hover))',
              'Pressed': 'rgb(var(--Primary-Stroke-Compound-Pressed))',
              'Selected': 'rgb(var(---Primary-Stroke-Compound-Selected))',
            }
          },
        },

        'Status': {
          'Danger': {
            'Background': {
              1: { 'Rest': 'rgb(var(--Status-Danger-Background-1-Rest))' },
              2: { 'Rest': 'rgb(var(--Status-Danger-Background-2-Rest))' },
            },

            'Foreground': {
              1: { 'Rest': 'rgb(var(--Status-Danger-Foreground-1-Rest))' },
            },

            'Stroke': {
              1: { 'Rest': 'rgb(var(--Status-Danger-Stroke-1-Rest))' },
            },
          },
        },
      },
    },
  },
  variants: {},
  plugins: [
    require('tailwindcss/plugin')(({ addVariant }) => {
      addVariant('search-cancel', '&::-webkit-search-cancel-button')
    })
  ],

};