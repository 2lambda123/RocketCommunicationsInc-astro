/* eslint react/jsx-no-bind: 0 */ // --> OFF
import {
    Component,
    Host,
    h,
    State,
    Prop,
    Element,
    Listen,
    Event,
    EventEmitter,
    Watch,
} from '@stencil/core'

/**
 * @slot (default) - Used for instances of rux-tab
 */
@Component({
    tag: 'rux-tabs',
    styleUrl: 'rux-tabs.scss',
    shadow: true,
})
export class RuxTabs {
    @Element() el!: HTMLRuxTabsElement
    /**
     *  Holds all `<rux-tab-panel>` components based on the event emitted from the `<rux-tab-panels>` component.
     */
    @State() _panels: Array<HTMLRuxTabPanelElement> = []
    /**
     *  Holds all `<rux-tab>` components that are children of `<rux-tabs>`.
     */
    @State() _tabs: Array<HTMLRuxTabElement> = []

    /**
     * If passed or set to true, displays the tabs in a smaller style, suitable for limited-space uses.
     */
    @Prop() small?: boolean

    @Listen('ruxregisterpanels', { target: 'window' })
    handleListen(e: CustomEvent) {
        this._registerPanels(e)
    }

    @Watch('small')
    handleSmallChange() {
        //determine whether or not to pass small attr to child tabs
        if (this.small) {
            this._tabs.forEach((tab) => tab.setAttribute('small', ''))
        } else {
            this._tabs.forEach((tab) => {
                if (tab.hasAttribute('small')) {
                    tab.removeAttribute('small')
                }
            })
        }
    }

    @Listen('keydown', { target: 'document' })
    onKeydown(e: any) {
        if (e.target && !this.el.contains(e.target)) {
            return
        }

        // Get all tabs inside of the radio group and then
        // filter out disabled radios since we need to skip those
        const tabs = this._tabs.filter((tab) => !tab.disabled)

        // Only move the radio if the current focus is in the radio group
        if (e.target && tabs.includes(e.target)) {
            const index = tabs.findIndex((tab) => tab === e.target)

            let next

            // If hitting arrow down or arrow right, move to the next radio
            // If we're on the last radio, move to the first radio
            if (['ArrowDown', 'ArrowRight'].includes(e.code)) {
                next = index === tabs.length - 1 ? tabs[0] : tabs[index + 1]
            }

            // If hitting arrow up or arrow left, move to the previous radio
            // If we're on the first radio, move to the last radio
            if (['ArrowUp', 'ArrowLeft'].includes(e.code)) {
                next = index === 0 ? tabs[tabs.length - 1] : tabs[index - 1]
            }

            if (next && tabs.includes(next)) {
                const nextFocus = next.shadowRoot?.querySelector(
                    '.rux-tab'
                ) as HTMLElement
                nextFocus.focus()
            }
        }
    }

    /**
     * Fires whenever a new tab is selected, and emits the selected tab on the event.detail.
     */
    @Event({ eventName: 'ruxselected' }) ruxSelected!: EventEmitter

    connectedCallback() {
        this._addTabs()
    }

    private _addTabs() {
        this._tabs = Array.from(this.el.querySelectorAll('rux-tab'))
    }

    private _registerPanels(e: CustomEvent) {
        e.detail.forEach((panel: HTMLRuxTabPanelElement) => {
            this._panels.push(panel)
        })
        // run addTabs if this event was heard.
        this._addTabs()

        // Default to first tab if none are selected
        const selectedTab =
            this._tabs.find((tab) => tab.selected) || this._tabs[0]
        this._setTab(selectedTab)
    }

    private _onPress(e: KeyboardEvent) {
        e.key === 'Enter' ? this._onClick(e) : null
    }

    private _onClick(e: KeyboardEvent | MouseEvent) {
        const target = e.target as HTMLElement
        //get the tab in case complex html is nested inside rux-tab
        const tab = target.closest('rux-tab') as HTMLRuxTabElement
        this.ruxSelected.emit(tab)
        if (
            tab.getAttribute('role') === 'tab' &&
            tab.getAttribute('disabled') === null
        ) {
            this._setTab(tab)
        }
    }

    private _reset() {
        // hide everything
        // Only reset the tabs and panels that are part of this instance of rux-tabs

        this._tabs.forEach((tab) => {
            if (tab.parentElement === this.el) tab.selected = false
        })
        this._panels.forEach((panel) => {
            if (
                panel.parentElement?.getAttribute('aria-labelledby') ===
                this.el.id
            )
                panel.classList.add('hidden')
        })
    }

    private _setTab(selectedTab: HTMLRuxTabElement) {
        this._reset()
        // find the panel whose aria-labeldby attribute matches the tab’s id
        const selectedPanel = this._panels.find(
            (panel) =>
                panel.getAttribute('aria-labelledby') ===
                selectedTab.getAttribute('id')
        )

        if (selectedTab) selectedTab.selected = true
        if (selectedPanel) selectedPanel.classList.remove('hidden')
    }

    render() {
        return (
            <Host
                onClick={(e: MouseEvent) => this._onClick(e)}
                onKeyPress={(e: KeyboardEvent) => this._onPress(e)}
                role="tablist"
            >
                <slot></slot>
            </Host>
        )
    }
}
