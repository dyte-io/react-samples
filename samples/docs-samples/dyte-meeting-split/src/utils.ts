import { UIConfig } from "@dytesdk/ui-kit";

export function setFullScreenToggleTargetElement({config, targetElementId}: { config: UIConfig, targetElementId: string }){
    if (config.root && Array.isArray(config.root['div#controlbar-left'])) {
        const fullScreenToggleIndex = config.root['div#controlbar-left'].indexOf('dyte-fullscreen-toggle');
        if(fullScreenToggleIndex > -1){
            config.root['div#controlbar-left'][fullScreenToggleIndex] = ['dyte-fullscreen-toggle', {
                variant: 'vertical',
                targetElement: document.querySelector(`#${targetElementId}`),
            }];
        }
    }
    ['dyte-more-toggle.activeMoreMenu', 'dyte-more-toggle.activeMoreMenu.md', 'dyte-more-toggle.activeMoreMenu.sm'].forEach((configElemKey) => {
        const configElem = config?.root?.[configElemKey] as any;
        configElem?.forEach((dyteElemConfigSet: any) => {
            if (dyteElemConfigSet[0] === 'dyte-fullscreen-toggle') {
                dyteElemConfigSet[1].targetElement = document.querySelector(`#${targetElementId}`);
            }
        });
    });
}