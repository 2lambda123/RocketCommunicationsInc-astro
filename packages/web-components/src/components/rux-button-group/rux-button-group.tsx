import { Prop, Component, h } from '@stencil/core'

/**
 * @slot (default) - Two or more RuxButton components to render in the group
 *
 * @part container - the components container
 */
@Component({
    tag: 'rux-button-group',
    styleUrl: 'rux-button-group.scss',
    shadow: true,
})
export class RuxButtonGroup {
    /**
     * The horizontal alignment of buttons within the group
     */
    @Prop({
        attribute: 'h-align',
    })
    hAlign: 'left' | 'center' | 'right' = 'left'

    render() {
        const { hAlign } = this
        return (
            <div
                class={{
                    'rux-button-group': true,
                    'rux-button-group--left': hAlign === 'left',
                    'rux-button-group--right': hAlign === 'right',
                    'rux-button-group--center': hAlign === 'center',
                }}
                part="container"
            >
                <slot></slot>
            </div>
        )
    }
}
