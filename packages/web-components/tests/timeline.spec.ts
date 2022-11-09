import { test, expect } from './utils/_astro-fixtures'

test.describe('Timeline', () => {
    test('has no visual regression @vrt', async ({page}) => {
        await page.goto('/components/rux-timeline/test/basic')
        await expect(page).toHaveScreenshot()
    })
    test.beforeEach(async ({ astroPage, page }) => {
        const template = `
            <rux-timeline
                data-test-id="timeline"
                start="2021-02-01T00:00:00Z"
                end="2021-02-05T12:00:00Z"
                position="2021-02-01T04:00:00Z"
                interval="hour"
                zoom="1"
                timezone="America/New_York"
            >
                <rux-track data-test-id="track1">
                    <div slot="label">Track 1</div>
                </rux-track>
                <rux-track data-test-id="track2">
                    <div slot="label">Track 2</div>
                    <rux-time-region
                        data-test-id="editEvent"
                        start="2021-02-01T01:00Z"
                        end="2021-02-01T04:00Z"
                        >Existing Event</rux-time-region
                    >
                </rux-track>
                <rux-track slot="ruler">
                    <rux-ruler></rux-ruler>
                </rux-track>
            </rux-timeline>
            <button
                onclick="addEvent('2021-01-30T00:00:00Z', '2021-02-02T00:00:00Z')"
                id="add-partial-start-button"
            >
                Add Partial Start Event
            </button>
            <button
                onclick="addEvent('2021-02-01T00:00:00Z', '2021-02-12T00:00:00Z')"
                id="add-partial-end-button"
            >
                Add Partial End Event
            </button>
            <button
                onclick="addEvent('2021-01-30T00:00:00Z', '2021-02-30T00:00:00Z')"
                id="add-partial-ongoing-button"
            >
                Add Partial Ongoing Event
            </button>

            <button
                onclick="editEvent('2021-01-30T00:00:00Z', '2021-02-02T00:00:00Z')"
                id="edit-partial-start-button"
            >
                Edit Partial Start Event
            </button>
            <button
                onclick="editEvent('2021-02-01T00:00:00Z', '2021-02-12T00:00:00Z')"
                id="edit-partial-end-button"
            >
                Edit Partial End Event
            </button>
            <button
                onclick="editEvent('2021-01-30T00:00:00Z', '2021-02-30T00:00:00Z')"
                id="edit-partial-ongoing-button"
            >
                Edit Partial Ongoing Event
            </button>
        `

         await astroPage.load(template)
     
        await page.addScriptTag({
            content: `
            globalThis.addEvent = (start, end) => {
                const el = document.createElement('rux-time-region')
                el.start = start
                el.end = end
                el.innerHTML = 'Test Event'
                el.setAttribute('data-test-id', 'addEvent')
                const track = document.querySelector('[data-test-id="track1"]')
                track.appendChild(el)
            }
            globalThis.editEvent = (start, end) => {
                const el = document.querySelector('[data-test-id="editEvent"]')
                el.start = start
                el.end = end
            }`,
        })
    })

    test('it renders', async ({ astroPage }) => {
        const el = astroPage.firstChild
        await expect(el).toBeVisible()
        await expect(el).toHaveClass('hydrated')
    })

    test('when an event is currently in the timelines range if the timelines range is changed so that the event becomes out of range should not display as partial and be hidden', async ({ astroPage }) => {
        const el = astroPage.firstChild

        await el.evaluate((e) => {
            e.setAttribute('end', '2022-02-30')
            e.setAttribute('start', '2022-02-10')
        })

        const timeRegion = el.locator('.rux-time-region')
        await expect(timeRegion).not.toHaveClass(
            'rux-time-region--partial-start rux-time-region--partial-end'
        )
        await timeRegion
            .evaluate((e) => e.hasAttribute('partial'))
            .then((e) => expect(e).toBeFalsy())
    })
    test('if new event start date is before the timeline start date it should display as a partial start event', async ({ astroPage, page }) => {
        const el = astroPage.firstChild
            .locator('rux-time-region[data-test-id="addEvent"] div')
            .first()
        const button = page.locator('#add-partial-start-button')

        await button.click()

        await expect(el).toHaveClass(
            'rux-time-region rux-time-region--partial-start'
        )
    })
    test('if new event start date is after the timeline end date it should display as a partial end event', async ({ astroPage, page }) => {
        const el = page
            .locator('rux-time-region[data-test-id="addEvent"] div')
            .first()
        const button = page.locator('#add-partial-end-button')

        await button.click()

        await expect(el).toHaveClass(
            'rux-time-region rux-time-region--partial-end'
        )
    })
    test('if new event start date is before the timeline start date and the end date is after the timelines start date it should display an ongoing partial event', async ({ astroPage, page }) => {
        const el = page
            .locator('rux-time-region[data-test-id="addEvent"] div')
            .first()
        const button = page.locator('#add-partial-ongoing-button')

        await button.click()

        await expect(el).toHaveClass(
            'rux-time-region rux-time-region--partial-start rux-time-region--partial-end'
        )
    })
    test('existing in-range event is edited, if the event start date is before the timeline start date it should display as a partial start event', async ({ astroPage, page }) => {
        const el = page
            .locator('rux-time-region[data-test-id="editEvent"] div')
            .first()
        const button = page.locator('#edit-partial-start-button')

        await button.click()

        await expect(el).toHaveClass(
            'rux-time-region rux-time-region--partial-start'
        )
    })
    test('existing in-range event is edited, if the event end date is after the timeline end date it should display as a partial end event', async ({
        page,
    }) => {
        const el = page
            .locator('rux-time-region[data-test-id="editEvent"] div')
            .first()
        const button = page.locator('#edit-partial-end-button')

        await button.click()

        await expect(el).toHaveClass(
            'rux-time-region rux-time-region--partial-end'
        )
    })
    test('existing in-range event is edited, if the event start date is before the timeline start date and the end date is after the timelines start date it should display as a partial ongoing event', async ({ page }) => {
        const el = page
            .locator('rux-time-region[data-test-id="editEvent"] div')
            .first()
        const button = page.locator('#edit-partial-ongoing-button')

        await button.click()

        await expect(el).toHaveClass(
            'rux-time-region rux-time-region--partial-start rux-time-region--partial-end'
        )
    })
})

// Should throw an error when trying to set the playhead position to a date that is not within the timeline range.

// displays error if time region start is after time region end
// displays error if time region start is missing
// displays error if time region end is missing

// partial tests
// event is partial start. it should visually indicate. timeline range is changed so that it is in range. event should no longer visually indicate.
