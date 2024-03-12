import themes from './theme'
import { addons } from '@storybook/manager-api'

addons.setConfig({
    panelPosition: 'right',
    selectedPanel: 'REACT_STORYBOOK/readme/panel',
    theme: themes.dark,
    sidebar: {
        // showRoots: false,
    },
})
