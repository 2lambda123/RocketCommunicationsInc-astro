import {
    Prop,
    Host,
    Component,
    Event,
    EventEmitter,
    h,
    Element,
    State,
    Watch,
} from '@stencil/core'
import FormFieldMessage from '../../common/functional-components/FormFieldMessage/FormFieldMessage'
import { FormFieldInterface } from '../../common/interfaces.module'
import { hasSlot, renderHiddenInput } from '../../utils/utils'

let id = 0

/**
 * @slot label - The input label
 * @slot prefix - Left side input icon
 * @slot suffix - Right side input icon
 * @part error-text - The error text element
 * @part form-field - The form-field wrapper container
 * @part help-text - The help text element
 * @part icon - The icon displayed when toggle-password prop is set
 * @part input-field - the styled wrapper around the input element
 * @part input - The input element
 * @part label - The input label when `label` prop is set
 * @part required - The asterisk when required is true
 * @part prefix - The container of the prefix slot
 * @part suffix - The container of the suffix slot
 *
 */
@Component({
    tag: 'rux-input',
    styleUrl: 'rux-input.scss',
    shadow: true,
})
export class RuxInput implements FormFieldInterface {
    private inputId = `rux-input-${++id}`

    @Element() el!: HTMLRuxInputElement

    @State() hasLabelSlot = false

    @State() togglePassword = false

    @State() isPasswordVisible = false

    @State() hasFocus = false

    /**
     * The input label text. For HTML content, use the `label` slot instead.
     */
    @Prop() label?: string
    /**
     * The input placeholder text
     */
    @Prop() placeholder?: string

    /**
     * The help or explanation text
     */
    @Prop({ attribute: 'help-text' }) helpText?: string

    /**
     * The validation error text
     */
    @Prop({ attribute: 'error-text' }) errorText?: string

    /**
     * Presentational only. Renders the Input Field as invalid.
     */
    @Prop() invalid = false

    /**
     * The input value
     */
    @Prop({ mutable: true, reflect: true }) value: string = ''

    /**
     * The input name
     */
    @Prop() name = ''

    /**
     * The input type
     */
    @Prop() type:
        | 'text'
        | 'number'
        | 'email'
        | 'url'
        | 'search'
        | 'password'
        | 'date'
        | 'datetime-local'
        | 'time'
        | 'tel' = 'text'

    /**
     * The input min attribute
     */
    @Prop() min?: string

    /**
     * The input max attribute
     */
    @Prop() max?: string

    /**
     * Disables the button via HTML disabled attribute. Button takes on a distinct visual state. Cursor uses the not-allowed system replacement and all keyboard and mouse events are ignored.
     */
    @Prop({ reflect: true }) disabled = false

    /**
     * Sets the input as required
     */
    @Prop() required: boolean = false

    /**
     * Control the padding around the input field
     */
    @Prop() size: 'small' | 'medium' | 'large' = 'medium'

    /**
     * The input step attribute
     */
    @Prop() step?: string

    /**
     * The input's spellcheck attribute
     */
    @Prop() spellcheck = false

    /**
     * The inputs readonly attribute
     */
    @Prop() readonly = false

    /**
     * Fired when the value of the input changes - [HTMLElement/input_event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event)
     */
    @Event({ eventName: 'ruxchange' }) ruxChange!: EventEmitter

    /**
     * Fired when an alteration to the input's value is committed by the user - [HTMLElement/change_event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event)
     */
    @Event({ eventName: 'ruxinput' }) ruxInput!: EventEmitter

    /**
     * Fired when an element has lost focus - [HTMLElement/blur_event](https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event)
     */
    @Event({ eventName: 'ruxblur' }) ruxBlur!: EventEmitter

    /**
     * Fired when an element has gained focus - [HTMLElement/focus_event](https://developer.mozilla.org/en-US/docs/Web/API/Element/focus_event)
     */
    @Event({ eventName: 'ruxfocus' }) ruxFocus!: EventEmitter

    @Watch('label')
    handleLabelChange() {
        this._handleSlotChange()
    }

    @Watch('type')
    handleTypeChange() {
        this._setTogglePassword()
    }

    connectedCallback() {
        this._onChange = this._onChange.bind(this)
        this._onInput = this._onInput.bind(this)
        this._handleSlotChange = this._handleSlotChange.bind(this)
        this._handleTogglePassword = this._handleTogglePassword.bind(this)
    }

    disconnectedCallback() {
        this.el!.shadowRoot!.removeEventListener(
            'slotchange',
            this._handleSlotChange
        )
    }

    componentWillLoad() {
        this._handleSlotChange()
        this._setTogglePassword()
    }

    get hasLabel() {
        return this.label ? true : this.hasLabelSlot
    }

    private _onChange(e: Event) {
        const target = e.target as HTMLInputElement
        this.value = target.value
        this.ruxChange.emit()
    }

    private _onInput(e: Event) {
        const target = e.target as HTMLInputElement
        this.value = target.value
        this.ruxInput.emit()
    }

    private _onBlur = () => {
        this.ruxBlur.emit()
        this.hasFocus = false
    }

    private _onFocus = () => {
        this.ruxFocus.emit()
        this.hasFocus = true
    }

    private _handleSlotChange() {
        this.hasLabelSlot = hasSlot(this.el, 'label')
    }

    private _setTogglePassword() {
        this.type === 'password' ? (this.togglePassword = true) : false
    }

    private _handleTogglePassword() {
        this.isPasswordVisible = !this.isPasswordVisible
    }

    render() {
        const {
            disabled,
            el,
            errorText,
            helpText,
            inputId,
            invalid,
            label,
            max,
            min,
            name,
            _onChange,
            _onInput,
            _onBlur,
            _onFocus,
            _handleSlotChange,
            _handleTogglePassword,
            placeholder,
            required,
            step,
            type,
            value,
            hasLabel,
            size,
            spellcheck,
            readonly,
            togglePassword,
            isPasswordVisible,
        } = this

        renderHiddenInput(true, el, name, value, disabled)
        return (
            <Host>
                <div class="rux-form-field" part="form-field">
                    {hasLabel ? (
                        <label
                            class={{
                                'rux-input-label': true,
                            }}
                            part="label"
                            aria-hidden={hasLabel ? 'false' : 'true'}
                            htmlFor={inputId}
                        >
                            <span
                                class={{
                                    hidden: !hasLabel,
                                }}
                            >
                                <slot
                                    name="label"
                                    onSlotchange={_handleSlotChange}
                                >
                                    {label}
                                    {required && (
                                        <span
                                            part="required"
                                            class="rux-input-label__asterisk"
                                        >
                                            &#42;
                                        </span>
                                    )}
                                </slot>
                            </span>
                        </label>
                    ) : null}

                    <div
                        part="input-field"
                        class={{
                            'rux-input': true,
                            'rux-input--focused': this.hasFocus,
                            'rux-input--disabled': disabled,
                            'rux-input--invalid': invalid,
                            'rux-input--search': type === 'search',
                            'rux-input--small': size === 'small',
                            'rux-input--medium': size === 'medium',
                            'rux-input--large': size === 'large',
                        }}
                    >
                        <span part="prefix" class="rux-input-prefix">
                            <slot name="prefix"></slot>
                        </span>
                        <input
                            name={name}
                            disabled={disabled}
                            type={
                                type === 'password' && this.isPasswordVisible
                                    ? 'text'
                                    : type
                            }
                            aria-invalid={invalid ? 'true' : 'false'}
                            placeholder={placeholder}
                            required={required}
                            step={step}
                            min={min}
                            max={max}
                            value={value}
                            class="native-input"
                            id={inputId}
                            spellcheck={spellcheck}
                            readonly={readonly}
                            onChange={_onChange}
                            onInput={_onInput}
                            onBlur={_onBlur}
                            onFocus={_onFocus}
                            part="input"
                        ></input>
                        {togglePassword ? (
                            <button
                                onClick={_handleTogglePassword}
                                class="pw-button"
                            >
                                <rux-icon
                                    exportparts="icon"
                                    icon={
                                        isPasswordVisible
                                            ? 'visibility-off'
                                            : 'visibility'
                                    }
                                    size="22px"
                                />
                            </button>
                        ) : null}
                        <span part="suffix" class="rux-input-suffix">
                            <slot name="suffix"></slot>
                        </span>
                    </div>
                </div>

                <FormFieldMessage
                    errorText={errorText}
                    helpText={helpText}
                ></FormFieldMessage>
            </Host>
        )
    }
}
