

let apiKey = 'YOUR_API_KEY_HERE'
let fuelType = 'e5' //	'e5', 'e10', 'diesel'
let param = args.widgetParameter

const widget = new ListWidget()
const cheapestStation = await fetchfuelPrices()
await createWidget()


// used for debugging if script runs inside the app
if (!config.runsInWidget) {
    await widget.presentSmall()
}
Script.setWidget(widget)
Script.complete()

// build the content of the widget
async function createWidget() {

    widget.addSpacer(4)
    const logoImg = await getImage('r.png','https://cdn.retz.io/img/R.png')

    widget.setPadding(10, 10, 10, 10)
    const titleFontSize = 12
    const detailFontSize = 36

    const logoStack = widget.addStack()
    logoStack.addSpacer(86)
    const logoImageStack = logoStack.addStack()
    logoStack.layoutHorizontally()
    logoImageStack.backgroundColor = new Color("#ffffff", 1.0)
    logoImageStack.cornerRadius = 8
    const wimg = logoImageStack.addImage(logoImg)
    wimg.imageSize = new Size(40, 40)
    wimg.rightAlignImage()
    widget.addSpacer()

    const icon = await getImage('gasstation.png','https://cdn.retz.io/assets/gasstation.png')
    let row = widget.addStack()
    row.layoutHorizontally()
    row.addSpacer(2)
    const iconImg = row.addImage(icon)
    iconImg.imageSize = new Size(40, 40)
    row.addSpacer(13)

    let column = row.addStack()
    column.layoutVertically()

    const fuelText = column.addText("Preis (" + fuelType.toUpperCase() + ")")
    fuelText.font = Font.mediumRoundedSystemFont(13)

    const fuelPrice = column.addText(cheapestStation.price.toString())
    fuelPrice.font = Font.mediumRoundedSystemFont(22)

    fuelPrice.textColor = new Color("#00CD66")
    widget.addSpacer(4)

    const row2 = widget.addStack()
    row2.layoutVertically()

    const gasstationname = row2.addText(cheapestStation.name)
    gasstationname.font = Font.regularSystemFont(11)

    const street = row2.addText(cheapestStation.street + " " + cheapestStation.houseNumber)
    street.font = Font.regularSystemFont(11)

    const zipCity = row2.addText(cheapestStation.postCode + " " + cheapestStation.place)
    zipCity.font = Font.regularSystemFont(11)

    let isOpen = cheapestStation.isOpen;
    let shopStateText
    if (isOpen) {
        shopStateText = row2.addText('Geöffnet')
        shopStateText.textColor = new Color("#00CD66")
    } else {
        shopStateText = row2.addText('Geschlossen')
        shopStateText.textColor = new Color("#E50000")
    }
    shopStateText.font = Font.mediumSystemFont(11)
}


async function fetchfuelPrices() {
    let location = await Location.current()
    let url
    let counter = 0
        url = 'https://creativecommons.tankerkoenig.de/json/list.php?lat=' + location.latitude + '&lng='+location.longitude+'&sort=price&rad=5&type='+ fuelType+'&apikey=' + apiKey
        const req = new Request(url)
        const apiResult = await req.loadJSON()
    let cheapestStation = apiResult.stations[0]
    return cheapestStation
}

async function getBrandLogo(brand){
    let brandlogo;
    switch(brand.toLowerCase){
        case "aral":
            brandlogo = getImage('aral.png','https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Aral_Logo.svg/480px-Aral_Logo.svg.png')
            break;
            case "shell":
            brandlogo = getImage('shell.png','https://upload.wikimedia.org/wikipedia/de/thumb/7/74/Royal_Dutch_Shell.svg/500px-Royal_Dutch_Shell.svg.png')
            break;
            case "esso":
            brandlogo = getImage('esso.png','https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Esso-Logo.svg/640px-Esso-Logo.svg.png')
            break;
            case "jet":
            brandlogo = getImage('jet.png','https://upload.wikimedia.org/wikipedia/de/thumb/e/e5/JET.svg/500px-JET.svg.png')
            break;
        default:
            brandlogo = getImage('gasstation.png','https://cdn.retz.io/assets/gasstation.png')
    }
    return brandlogo;
}

// get images from local filestore or download them once
async function getImage(image,url = null) {
    let fm = FileManager.local()
    let dir = fm.documentsDirectory()
    let path = fm.joinPath(dir, image)
    if (fm.fileExists(path)) {
        return fm.readImage(path)
    } else {
        // download once
        let imageUrl
        if(url = null){
            console.log(`Sorry, couldn't find ${image}.`);
        }
        imageUrl = url;
        
        let iconImage = await loadImage(imageUrl)
        fm.writeImage(path, iconImage)
        return iconImage
    }
}

// helper function to download an image from a given url
async function loadImage(imgUrl) {
    const req = new Request(imgUrl)
    return await req.loadImage()
}



// end of script
// bitte bis zum Ende kopieren
