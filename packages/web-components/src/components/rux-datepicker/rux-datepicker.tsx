import {
    Event,
    Watch,
    EventEmitter,
    Prop,
    Element,
    Component,
    h,
    Host,
} from '@stencil/core'

@Component({
    tag: 'rux-datepicker',
    styleUrl: 'rux-datepicker.scss',
    shadow: true,
})
export class RuxDatepicker {
    @Element() el!: HTMLRuxDatepickerElement

    @Prop() max?: number

    @Prop() min?: number

    @Prop() julian: boolean = false

    @Prop() standard: boolean = true

    @Prop({ reflect: true, mutable: true }) open: boolean = false

    //ruxCalendarExanded? ruxDatepickerExpanded? opened? closed?
    @Event({ eventName: 'ruxexpanded' }) ruxExpanded!: EventEmitter
    @Event({ eventName: 'ruxcollapsed' }) ruxCollapsed!: EventEmitter

    @Watch('open')
    handleOpen() {
        this.open ? this.ruxExpanded.emit() : this.ruxCollapsed.emit()
    }

    // connectedCallback() {
    //     this._handleClick = this._handleClick.bind(this)
    // }

    // private _handleClick() {
    //     this.open = !this.open
    // }

    render() {
        return (
            <Host>
                <div class="rux-datepicker">
                    <div class="input-wrapper">
                        <div class="editable-input" contentEditable>
                            YYYY / MM / DD
                        </div>
                        <rux-pop-up placement="bottom-end">
                            <rux-icon
                                icon="calendar-today"
                                size="22px"
                                slot="trigger"
                            ></rux-icon>
                            <rux-calendar>
                                {/* We could do an includeFooter prop? should it be there by default? */}
                                <rux-button-group slot="footer">
                                    <rux-button secondary>Cancel</rux-button>
                                    <rux-button>Submit</rux-button>
                                </rux-button-group>
                            </rux-calendar>
                        </rux-pop-up>
                    </div>
                </div>
            </Host>
        )
    }
}
