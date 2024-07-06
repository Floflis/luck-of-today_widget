const Desklet = imports.ui.desklet;
const St = imports.gi.St;
const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;
const Lang = imports.lang;

class FloflisLuckDesklet extends Desklet.Desklet {
    constructor(metadata, desklet_id) {
        super(metadata, desklet_id);
        this._metadata = metadata;
        this.setupUI();
        this.updateQuote();
    }

    setupUI() {
        this.window = new St.BoxLayout({vertical: false, style_class: 'floflis-luck-desklet'});
        
        this.imageContainer = new St.Bin({style_class: 'image-container'});
        let iconPath = GLib.build_filenamev([this._metadata.path, "icon.png"]);
        let icon = new St.Icon({gicon: new Gio.FileIcon({file: Gio.file_new_for_path(iconPath)}), icon_size: 48});
        this.imageContainer.set_child(icon);

        this.textContainer = new St.BoxLayout({vertical: true, style_class: 'text-container'});
        
        this.titleLabel = new St.Label({text: "Floflis Luck of Today", style_class: 'title-label'});
        this.quoteLabel = new St.Label({text: "Loading quote...", style_class: 'quote-label'});
        
        this.textContainer.add(this.titleLabel);
        this.textContainer.add(this.quoteLabel);

        this.window.add(this.imageContainer);
        this.window.add(this.textContainer);

        this.setContent(this.window);
    }

    updateQuote() {
        let quotes = this.loadQuotes();
        let randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        this.quoteLabel.set_text(randomQuote);
    }

    loadQuotes() {
        let quotesPath = GLib.build_filenamev([this._metadata.path, "quotes.js"]);
        let quotesFile = Gio.file_new_for_path(quotesPath);
        let [success, contents] = quotesFile.load_contents(null);

        if (success) {
            let quotesData = JSON.parse(contents);
            return quotesData.quotes;
        } else {
            global.logError("Failed to load quotes file");
            return ["Failed to load quote"];
        }
    }

    on_desklet_clicked() {
        this.updateQuote();
    }
}

function main(metadata, desklet_id) {
    return new FloflisLuckDesklet(metadata, desklet_id);
}
