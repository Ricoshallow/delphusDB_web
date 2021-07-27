import xml.etree.ElementTree as ET
import io

tree = ET.parse("windowsZones.xml")
mapTimeZones = tree.find("windowsZones/mapTimezones")
mapContent = io.StringIO()

otherVersion = mapTimeZones.get("otherVersion")
typeVersion = mapTimeZones.get("typeVersion")

mapContent.write("#Generated by CLDR windowsZones.xml(otherVersion:{0},typeVersion:{1})\n".format(
    otherVersion, typeVersion))

for mz in mapTimeZones.iter("mapZone"):
    winTzKeyName = mz.get("other")
    region = mz.get("territory")
    posixTz = mz.get("type")
    if winTzKeyName is None or region is None or posixTz is None:
        print("other:{0} territory:{1} type:{2},None detected".format(
            winTzKeyName, region, posixTz))
        exit(-1)
    mapContent.write("winTzKeyName=\"{0}\" region=\"{1}\" IanaTz=\"{2}\"\n".format(
        winTzKeyName, region, posixTz))

tzmapping = open("tzmapping","w")
tzmapping.write(mapContent.getvalue())
tzmapping.close()
