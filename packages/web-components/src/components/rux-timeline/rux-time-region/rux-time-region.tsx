import { Element, Prop, Component, State, Host, h } from '@stencil/core'
import differenceInMinutes from 'date-fns/differenceInMinutes'
import { differenceInDays, differenceInHours } from 'date-fns/esm'
import format from 'date-fns/format'
import { MyService } from '../MyServiceController'

@Component({
    tag: 'rux-time-region',
    styleUrl: 'rux-time-region.scss',
    shadow: true,
})
export class RuxTimeRegion {
    // private ruxTrack: HTMLRuxTrackElement | null = null
    private ruxTimeline: any
    @Element() el!: HTMLRuxTimeRegionElement
    /**
     * The start time
     */
    @Prop() start: any
    /**
     * The end time
     */
    @Prop() end: any

    /**
     * The label
     */
    @Prop() label?: string

    /**
     * The track
     */
    @Prop() track: string = '1'
    @Prop() ratio = 2

    @State() startOffset = 0
    @State() endOffset = 0
    componentWillLoad() {
        const start = new Date(this.start)
        const end = new Date(this.end)
        this.ruxTimeline = this.el?.closest('rux-timeline')

        // if (length < 60) {

        this.startOffset = start.getHours() * this.ratio
        this.endOffset = end.getHours() * this.ratio

        // MyService.getData().then(r => {
        //     console.log('res', r)
        // })
        // }

        // console.log('region track', this.track)
        // this.ruxTrack = this.el.closest('rux-track')
        // console.log('track', this.ruxTrack);
        // const id = this.ruxTrack?.getAttribute('track-id')
        // if (!id) {
        // console.log('no id', this.ruxTrack?.trackId)
        // }
        // console.log('id', id);
        // this.track = id ? id : '1'
    }

    // get ratio() {
    //     if (this.ruxTimeline.interval === 'hour') {
    //         return this.ruxTimeline.zoom / 60 // for hours.
    //     }

    //     if (this.ruxTimeline.interval === 'day') {
    //         return this.ruxTimeline.zoom / 120 //tbd
    //     }
    //     return 2
    // }

    calculateGridColumnFromTime(time: any) {
        console.log('test', this.ruxTimeline.start)
        const timelineStart = new Date(this.ruxTimeline.start)
        const difference = Math.abs(
            differenceInDays(timelineStart, new Date(time))
        )
        console.log('diff in hour', difference)

        return difference + 2
        // console.log('dif', difference);

        // const date = new Date(time)
        // const form = format(date, 'HH')
        // console.log('form', form);

        // // return new Date(time).getHours() + 2
        // return +form + 2
        // return +time.substring(0, 2) + 2
    }

    render() {
        console.log('rendering event', this.ratio)
        return (
            <Host>
                <div
                    part="container"
                    class="rux-time-region"
                    style={{
                        gridRow: `${this.track}`,
                        gridColumn: `${this.calculateGridColumnFromTime(
                            this.start
                        )} / ${this.calculateGridColumnFromTime(this.end)}`,
                        marginLeft: `${this.startOffset}px`,
                        marginRight: `-${this.endOffset}px`,
                    }}
                >
                    {this.ratio}
                    <div class="rux-time-region__content">
                        <slot></slot>
                    </div>
                    <div class="rux-time-region__datetime">
                        {format(new Date(this.start), 'HH:mm')} -{' '}
                        {format(new Date(this.end), 'HH:mm')}
                    </div>
                </div>
            </Host>
        )
    }
}
