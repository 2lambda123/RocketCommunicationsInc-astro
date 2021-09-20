import { Component, Prop, h } from '@stencil/core'
import svgIcon from '../../../icons/battery-charging-20.svg'

/**
     * WARNING: This is an autogenerated component.
     * Do not make any changes to this file or they will be overwritten on build.
     * The template for this file is located in the generate-icons.js util file.
     * /

    /** @internal **/
@Component({
    tag: 'rux-icon-battery-charging-20',
    shadow: false,
})
export class RuxIconBatteryCharging20 {
    /**
     * The size of the icon. Can be 'extra-small', 'small', 'normal', 'large', 'auto' or any custom value ('30px', '1rem', '3.321em')
     */

    @Prop() size:
        | 'extra-small'
        | 'small'
        | 'normal'
        | 'large'
        | 'auto'
        | string = 'auto'

    get iconSize() {
        const sizes: { [key: string]: any } = {
            'extra-small': '1rem',
            small: '2rem',
            normal: '3rem',
            large: '4rem',
        }

        if (sizes[this.size]) {
            return sizes[this.size]
        } else {
            return this.size
        }
    }
    render() {
        const style = {
            height: this.iconSize,
            width: this.iconSize,
        }

        return <div style={style} innerHTML={svgIcon}></div>
    }
}
