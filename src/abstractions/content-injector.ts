export interface ContentInjector {
    injectContent(): Promise<boolean>
}