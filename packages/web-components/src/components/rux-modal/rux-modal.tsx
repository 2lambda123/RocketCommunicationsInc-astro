import {
    Component,
    h,
    Prop,
    Event,
    EventEmitter,
    Element,
    Listen,
    Host,
} from '@stencil/core'

/**
 * @part wrapper - the modal wrapper overlay
 * @part header - the header of the modal
 * @part content - the content of the modal
 * @part footer - the footer of the modal
 */
@Component({
    tag: 'rux-modal',
    styleUrl: 'rux-modal.scss',
    shadow: { delegatesFocus: true },
})
export class RuxModal {
    /**
     * Shows and hides modal
     */
    @Prop({ reflect: true, mutable: true }) open: boolean = false
    /**
     * Allows modal to close by clicking off of it
     */
    @Prop() clickToClose: boolean = false

    /**
     * Event that is fired when modal closes
     */
    @Event({
        eventName: 'ruxmodalclosed',
        composed: true,
        bubbles: true,
    })
    ruxModalClosed!: EventEmitter<boolean>

    @Element() element!: HTMLRuxModalElement

    // close modal if click happens outside of dialog
    @Listen('click', { target: 'window' })
    handleClick(ev: MouseEvent) {
        if (this.clickToClose) {
            const wrapper = this._getWrapper()
            if (ev.composedPath()[0] === wrapper) {
                this.ruxModalClosed.emit(false)
                this.open = false
            }
        }
    }

    private _getWrapper(): HTMLElement | null {
        const wrapper = this.element?.shadowRoot?.querySelector(
            '.rux-modal__wrapper'
        ) as HTMLElement

        if (wrapper) {
            return wrapper
        }
        return null
    }

    render() {
        return (
            this.open && (
                <Host>
                    <div part="wrapper" class="rux-modal__wrapper">
                        <dialog class="rux-modal__dialog" role="dialog">
                            <header part="header" class="rux-modal__titlebar">
                                <slot name="header"></slot>
                            </header>
                            <div class="rux-modal__content">
                                <div part="content" class="rux-modal__message">
                                    <slot name="content"></slot>
                                </div>
                                <footer part="footer" class="rux-modal__footer">
                                    <slot name="footer"></slot>
                                </footer>
                            </div>
                        </dialog>
                    </div>
                </Host>
            )
        )
    }
}
