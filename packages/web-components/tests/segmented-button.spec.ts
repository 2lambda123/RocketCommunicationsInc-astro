import { test, expect } from './utils/_astro-fixtures'
import { startTestEnv, setBodyContent } from './utils/_startTestEnv'

test.describe('Segmented-button', () => {
    test('has no visual regression @vrt', async ({page}) => {
        await page.goto('/components/rux-segmented-button/test/basic')
        await expect(page).toHaveScreenshot()
    })
    startTestEnv()

    test('it renders', async ({ page }) => {
        await setBodyContent(
            page,
            `
        <div style="padding: 2.5% 5%">
            <rux-segmented-button></rux-segmented-button>
        </div>
        `
        )
        await page.addScriptTag({
            content: `
            const segmented = document.querySelector('rux-segmented-button')
            const data = [
                { label: 'First segment' },
                { label: 'Second segment', selected: true },
                { label: 'Third segment' },
            ]
            segmented.data = data
            segmented.addEventListener('click', () => {
                console.log('heard click')
            })
            segmented.addEventListener('ruxchange', () => {
                console.log('heard change')
            })

        `,
        })
        const el = page.locator('rux-segmented-button').first()
        await expect(el).toBeVisible()
        await expect(el).toHaveClass('hydrated')
    })
    test('it selects first item by default', async ({ page }) => {
        await setBodyContent(
            page,
            `
        <div style="padding: 2.5% 5%">
            <rux-segmented-button></rux-segmented-button>
        </div>
        `
        )
        await page.addScriptTag({
            content: `
            const segmented = document.querySelector('rux-segmented-button')
            const data = [
                { label: 'First segment' },
                { label: 'Second segment' },
                { label: 'Third segment' },
            ]
            segmented.data = data
            segmented.addEventListener('click', () => {
                console.log('heard click')
            })
            segmented.addEventListener('ruxchange', () => {
                console.log('heard change')
            })

        `,
        })
        const el = page.locator('rux-segmented-button').first()
        await expect(el).toHaveAttribute('selected', 'First segment')
    })
    test('it selects item from data array', async ({ page }) => {
        await setBodyContent(
            page,
            `
        <div style="padding: 2.5% 5%">
            <rux-segmented-button></rux-segmented-button>
        </div>
        `
        )
        await page.addScriptTag({
            content: `
            const segmented = document.querySelector('rux-segmented-button')
            const data = [
                { label: 'First segment' },
                { label: 'Second segment', selected: true },
                { label: 'Third segment' },
            ]
            segmented.data = data
            segmented.addEventListener('click', () => {
                console.log('heard click')
            })
            segmented.addEventListener('ruxchange', () => {
                console.log('heard change')
            })

        `,
        })
        const el = page.locator('rux-segmented-button').first()
        await expect(el).toHaveAttribute('selected', 'Second segment')
    })
    test('selects item from selected attribute', async ({ page }) => {
        await setBodyContent(
            page,
            `
        <div style="padding: 2.5% 5%">
            <rux-segmented-button selected="First segment"></rux-segmented-button>
        </div>
        `
        )
        await page.addScriptTag({
            content: `
            const segmented = document.querySelector('rux-segmented-button')
            const data = [
                { label: 'First segment' },
                { label: 'Second segment'},
                { label: 'Third segment' },
            ]
            segmented.data = data
            segmented.addEventListener('click', () => {
                console.log('heard click')
            })
            segmented.addEventListener('ruxchange', () => {
                console.log('heard change')
            })

        `,
        })
        const el = page.locator('rux-segmented-button').first()
        await expect(el).toHaveAttribute('selected', 'First segment')
    })
})
/*
    Need to test: 
    -has props data, size, disabled
*/
