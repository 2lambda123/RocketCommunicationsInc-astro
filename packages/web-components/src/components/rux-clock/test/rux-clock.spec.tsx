import { newSpecPage } from '@stencil/core/testing'
import { RuxClock } from '../rux-clock'
import { militaryTimezones } from '../military-timezones'

/**
 * NOTE: Timezone is set to UTC via npm test scripts.
 * This is due to lack of ability to configure Jest / Stencil limitation
 */
const RealDate = Date.now

beforeAll(() => {
    //Swap Date.now() with global mock - 1988-04-22 01:02:03
    global.Date.now = jest.fn(() => 577688523000)
})

afterAll(() => {
    //Replace our mock with the OG global Date.now()
    global.Date.now = RealDate
})

describe('rux-clock', () => {
    it('shows the current time', async () => {
        const clock = new RuxClock()
        expect(clock.time).toBe('05:02:03 UTC')
    })

    it('converts time to timezone', async () => {
        const clock = new RuxClock()
        clock.timezone = 'America/Los_Angeles'
        clock.timezoneChanged()

        expect(clock.time).toBe('22:02:03 PDT')
    })

    it('converts all military timezones', async () => {
        const clock = new RuxClock()
        const time = new Date(Date.now())
        for (const timezone in militaryTimezones) {
            clock._convertTimezone(timezone)
            const militaryTime = clock._formatTime(
                time,
                militaryTimezones[timezone]
            )
            clock.timezone = timezone
            clock.timezoneChanged()
            expect(clock.time).toBe(militaryTime)
        }
    })

    it('converts time to timezone on the fly', async () => {
        const clock = new RuxClock()
        expect(clock.time).toBe('05:02:03 UTC')
        clock.timezone = 'America/Los_Angeles'
        clock.timezoneChanged()
        expect(clock.time).toBe('22:02:03 PDT')
    })

    it('hides the timezone', async () => {
        const page = await newSpecPage({
            components: [RuxClock],
            html: `<rux-clock hide-timezone></rux-clock>`,
        })

        expect(page.root).toEqualHtml(`
          <rux-clock hide-timezone=\"\">
            <mock:shadow-root>
              <div class=\"rux-clock__day-of-the-year rux-clock__segment\">
                <div aria-labelledby=\"rux-clock__day-of-year-label\" class=\"rux-clock__segment__value\">
                  113
                </div>
                <div class="rux-clock__segment__label" id="rux-clock__day-of-year-label">
                  Date
                </div>
              </div>
              <div class=\"rux-clock__segment rux-clock__time\">
                <div aria-labelledby=\"rux-clock__time-label\" class=\"rux-clock__segment__value\">
                  05:02:03
                </div>
                <div class="rux-clock__segment__label" id="rux-clock__time-label">
                  Time
                </div>
              </div>
            </mock:shadow-root>
          </rux-clock>
        `)
    })

    it('hides the date', async () => {
        const page = await newSpecPage({
            components: [RuxClock],
            html: `<rux-clock hide-date></rux-clock>`,
        })

        expect(page.root).toEqualHtml(`
          <rux-clock hide-date=\"\">
            <mock:shadow-root>
              <div class=\"rux-clock__segment rux-clock__time\">
                <div aria-labelledby=\"rux-clock__time-label\" class=\"rux-clock__segment__value\">
                  05:02:03 UTC
                </div>
                <div class="rux-clock__segment__label" id="rux-clock__time-label">
                  Time
                </div>
              </div>
            </mock:shadow-root>
          </rux-clock>
        `)
    })

    it('hides the labels', async () => {
        const page = await newSpecPage({
            components: [RuxClock],
            html: `<rux-clock hide-labels></rux-clock>`,
        })

        expect(page.root).toEqualHtml(`
          <rux-clock hide-labels=\"\">
            <mock:shadow-root>
              <div class=\"rux-clock__day-of-the-year rux-clock__segment\">
                <div aria-labelledby=\"rux-clock__day-of-year-label\" class=\"rux-clock__segment__value\">
                  113
                </div>
              </div>
              <div class=\"rux-clock__segment rux-clock__time\">
                <div aria-labelledby=\"rux-clock__time-label\" class=\"rux-clock__segment__value\">
                  05:02:03 UTC
                </div>
              </div>
            </mock:shadow-root>
          </rux-clock>
      `)
    })

    it('shows los', async () => {
        const page = await newSpecPage({
            components: [RuxClock],
            html: `<rux-clock timezone="America/New_York" los="1988-04-22 12:12:12" hide-date></rux-clock>`,
        })

        const losTime = page.root.shadowRoot.querySelector(
            '#rux-clock__time--los'
        ).innerHTML
        expect(losTime).toBe('08:12:12')
    })

    it('shows aos', async () => {
        const date = Date.now()
        const page = await newSpecPage({
            components: [RuxClock],
            html: `<rux-clock timezone="America/New_York" aos="${date}" hide-date></rux-clock>`,
        })

        const aosTime = page.root.shadowRoot.querySelector(
            '#rux-clock__time--aos'
        ).innerHTML
        expect(aosTime).toBe('01:02:03')
    })
})
