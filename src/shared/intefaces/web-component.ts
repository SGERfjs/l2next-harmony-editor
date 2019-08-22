export interface IWebComponent {
    templates: string;

    get(): string;
    update(): void;
}