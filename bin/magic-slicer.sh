#!/bin/bash

# MagickSlicer https://github.com/VoidVolker/MagickSlicer
#
# The MIT License (MIT)
#
# Copyright (c) 2015 VoidVolker
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

version="0.004"
date="05/08/2015"

# ####### Options ####### #
# resultExt='png'
resultExt=''
resizeFilter='' # http://www.imagemagick.org/Usage/filter/
# resultDir='./sliceResult'
resultDir=''

# Selector fo slicer: A or B
scaleFromImage=true     # Type of scaling: if true - scale calculates from image size to down (slicer A), if false - image scale starts from tile size and grow up (slicer B)
gravity='NorthWest'     # Image positioning (from this option depends, which tiles sides can be cropped, if it not full size). Choices include: 'NorthWest', 'North', 'NorthEast', 'West', 'Center', 'East', 'SouthWest', 'South', 'SouthEast'. Use -list gravity to get a complete list of -gravity settings available in your ImageMagick installation.
extent=false            # Extent option (false - tiles be cropped, true - will be added transparent color to get all tiles of full size)
scale64=false
zoomReverse=false       # false: maxZoom=100%; true: minZoom=100%

# Options only for slicerB
scaleover=true            # Maximum zoom: bigger or less then image. False - will not create upscaled image for maximum zoom; true - last zoom be equal or grater, then image.
horizontal=true         # Type of positioning of image: horizontal or vertical.

# ####### Options end ####### #

# ———————————————————————————————————————————————————————————————————————————————————
# ####### Variables ####### #
imageSource=''
tileW=256
tileH=256
step=200
imageW=''
imageH=''
imOptions=''
dziFormat=true
verboseLevel=0
overlap=0   # TODO: Overlap handling.
# ———————————————————————————————————————————————————————————————————————————————————
# ####### Verbose functions ####### #
# (0=none, 1=warnings, 2=warnings+info, 3=warning+info+debug)

warnMsg(){
    if [ $verboseLevel -ge 1 ]
    then
        echo $1
    fi
}

infoMsg(){
    if [ $verboseLevel -ge 2 ]
    then
        echo $1
    fi
}

debugMsg(){
    if [ $verboseLevel -ge 3 ]
    then
        echo $1
    fi
}

# ———————————————————————————————————————————————————————————————————————————————————
# ####### CLI ####### #

qHelp(){
    echo "    -?, --help [option]"
    if [ "$1" = true ]
    then
        echo "        Show basic help or show help for selected option."
        echo
        echo "        Type:     str"
        echo
    fi
}

mHelp(){
    echo "    -m, --man"
    if [ "$1" = true ]
    then
        echo "        Show full help for all options."
        echo
        echo "        Type:     str"
        echo
    fi
}

iHelp(){
    echo "    [ -i, --in <file_path> ]"
    if [ "$1" = true ]
    then
        echo "        Input file to slice."
        echo
        echo "        Type:     str"
        echo
    fi
}

oHelp(){
    echo "    [ -o, --out <directory_path> ]"
    if [ "$1" = true ]
    then
        echo "        Output directory for result."
        echo
        echo "        Default:  same as source"
        echo "        Type:     str"
        echo
    fi
# sliceResult/<zoom_Level>/<horizontal tiles line (x) (folder)>/<vertical tiles line (y) (file)>"
}

eHelp(){
    echo "    [ -e, --extension <file_extesion> ]"
    if [ "$1" = true ]
    then
        echo "        Set result files extension."
        echo
        echo "        Default:  same as source"
        echo "        Type:     str"
        echo
    fi
}

wHelp(){
    echo "    [ -w, --width <tile_width> ]"
    if [ "$1" = true ]
    then
        echo "        Set tile width."
        echo
        echo "        Default:  256 pixels or same as height, if height is present."
        echo "        Type:     int"
        echo
    fi
}

hHelp(){
    echo "    [ -h, --height <tile_height> ]"
    if [ "$1" = true ]
    then
        echo "        Set tile height"
        echo
        echo "        Default:  256 pixels or same as width, if width is present."
        echo "        Type:     int"
        echo
    fi
}

sHelp(){
    echo "    [ -s, --step <zoom_step_value> ]"
    if [ "$1" = true ]
    then
        echo "        Zoom step value. Formula:"
        echo "          (1) image_size[i+1] = image_size[i] * 100 / step"
        echo "          200 -> 200% or 2x    -> 100% * 100 / 200 = 50%"
        echo "          175 -> 175% or 1.75x -> 100% * 100 / 175 = 57.(142857)%"
        echo "          120 -> 120% or 1.2x  -> 100% * 100 / 120 = 83.(3)%"
        echo "          300 -> 300% or 3x    -> 100% * 100 / 300 = 33.(3)%"
        echo "          100 -> 100% or 1x (no resize) -> infinity loop. Don't use it."
        echo
        echo "        Default:  200"
        echo "        Type:     int"
        echo
    fi
}

pHelp(){
    echo "    [ -p, --options 'imagemagick options string']"
    if [ "$1" = true ]
    then
        echo "        Specifies additional imagemagick options for 'convert'."
        echo
        echo "        Type:     str"
        echo
    fi
}

gHelp(){
    echo "    [ -g, --gravity <type> ]"
    if [ "$1" = true ]
    then
        echo "        Types: NorthWest North NorthEast West Center East SouthWest South SouthEast"
        echo "        The direction you choose specifies where to position of cuts start on image. Use -list gravity to get a complete list of -gravity settings available in your ImageMagick installation."
        echo "        http://www.imagemagick.org/script/command-line-options.php#gravity"
        echo
        echo "        Default:  NorthWest"
        echo "        Type:     str"
        echo
    fi
}

xHelp(){
    echo "    [ -x, --extent ]"
    if [ "$1" = true ]
    then
        echo "        Specifies the edge tiles size: cropped or extent them to full size and fill transparent color."
        echo
        echo "        Default:  false"
        echo "        Type:     logic switch"
        echo
    fi
}

dHelp(){
    echo "    [ -d, --dzi ]"
    if [ "$1" = true ]
    then
        echo "        Specifies output format."
        echo
        echo "        Default:  true"
        echo "        Type:     logic switch"
        echo
    fi
}

aHelp(){
    echo "    [ -a, --slicea ]"
    if [ "$1" = true ]
    then
        echo "        Type of slicing - slice A. Image scale starts from image size to down. Inverts option '--sliceb'."
        echo
        echo "        Default:  true"
        echo "        Type:     logic switch"
        echo
    fi
}

bHelp(){
    echo "    [ -b, --sliceb ]"
    if [ "$1" = true ]
    then
        echo "        Type of slicing - slice B. Image scale starts from tile size and grow up. Inverts option '--slicea'."
        echo
        echo "        Default:  false"
        echo "        Type:     logic switch"
        echo
    fi
}

cHelp(){
    echo "    [ -c, --scaleover ] "
    if [ "$1" = true ]
    then
        echo "        Create upscaled image for maximum zoom (last zoom be equal or grater, then image). zoom[i-1]_size < source_image_size < zoom[i]_size"
        echo "        Work only in slice B mode. In other cases ignored."
        echo
        echo "        Default:  false"
        echo "        Type:     logic switch"
        echo
    fi
}

rHelp(){
    echo "    [ -r, --horizontal ] "
    if [ "$1" = true ]
    then
        echo "        Tiles divide image on horizontal side without remains. On this side tiles will not be croped."
        echo "        Work only in slice B mode. In other cases ignored."
        echo
        echo "         ___ ___ ___  _ _"
        echo "        |   |   |   |  ^"
        echo "        |___|___|___|  Image"
        echo "        |___|___|___| _v_   <- Not full tiles."
        echo "        |_._|_._|_._| <-- Transparent color (extent=true) or cropped (extent=false)"
        echo
        echo "        Default:  true"
        echo "        Type:     logic switch"
        echo
    fi
}

tHelp(){
    echo "    [ -t, --vertical ] "
    if [ "$1" = true ]
    then
        echo "        Tiles divide image on vertical side without remains. On this side tiles will not be croped."
        echo "        Work only in slice B mode. In other cases ignored."
        echo
        echo "        |<-image->|"
        echo "         ___ ___ _ _  _ _"
        echo "        |   |   | |.|  ^"
        echo "        |___|___|_|_| _v_Tile"
        echo "        |   |   | |.|"
        echo "        |___|___|_|_|"
        echo "                   ^-- Transparent color (extent=true) or cropped (extent=false)"
        echo "                 ^--- Not full tiles"
        echo
        echo "        Default:  false"
        echo "        Type:     logic switch"
        echo
    fi
}

vHelp(){
    echo "    [ -v, --verbose <level> ]"
    if [ "$1" = true ]
    then
        echo "        User-selected verbosity levels:"
        echo "          - 0 = none"
        echo "          - 1 = warnings"
        echo "          - 2 = warnings + info"
        echo "          - 3 = warnings + info + debug"
        echo
    fi
    echo "    [ -v0, -v1, -v2, -v3 ]"
    if [ "$1" = true ]
    then
        echo "        Short commands for each verbosity level."
        echo
        echo "        Default:  0"
        echo "        Type:     logic switch"
        echo
    fi
}

lHelp(){
    echo "    [ -l, --overlap <pixels> ] "
    if [ "$1" = true ]
    then
        echo "        Tiles overlap in pixels."
        echo
        echo "        Default:  1"
        echo "        Type:     int"
        echo
    fi
}

uHelp(){
    echo "    Usage:"
    echo "        magick-slicer.sh -u|--usage"
    echo "        magick-slicer.sh -?|--help|-m|--man [option_name]"
    echo "        magick-slicer.sh [options] [-i] /source/image [[-o] result/dir]"
    echo "        magick-slicer.sh /source/image [options] [result/dir]"
    echo "        magick-slicer.sh /source/image [result/dir] [options]"
    echo
    echo "    Use quotes for path or options with spaces. First unknown string interpreting as source image, if it not defined. Second unknown string is interpreting as result path, if it not defined. Also, for source and result you can use options '-i' and '-o'."
    echo
}

cliHelp(){
    echo " Map tiles generator. License: MIT."
    echo " Version: $version"
    echo " Date: $date"
    echo

    case $1 in

        -i|--in)                iHelp true ;;
        -o|--out)               oHelp true ;;
        -e|--extension)         eHelp true ;;
        -w|--width)             wHelp true ;;
        -h|--height)            hHelp true ;;
        -s|--step)              sHelp true ;;
        # -l|--overlap)           lHelp true ;;
        -p|--options)           pHelp true ;;
        -g|--gravity)           gHelp true ;;
        -x|--extent)            xHelp true ;;
        -d|--dzi)               dHelp true ;;
        -a|--slicea)            aHelp true ;;
        -b|--sliceb)            bHelp true ;;
        -c|--scaleover)         cHelp true ;;
        -r|--horizontal)        rHelp true ;;
        -t|--vertical)          tHelp true ;;
        -v|--verbose)           vHelp true ;;
        -u|--usage)             uHelp true ;;
        -\?|--help)             qHelp true ;;
        -m|--man)               mHelp true ;;

        "")
            uHelp $2
            echo " Options list: "
            qHelp $2
            mHelp $2
            vHelp $2
            iHelp $2
            oHelp $2
            eHelp $2
            wHelp $2
            hHelp $2
            sHelp $2
            # lHelp $2
            pHelp $2
            gHelp $2
            xHelp $2
            dHelp $2
            aHelp $2
            bHelp $2
            cHelp $2
            rHelp $2
            tHelp $2
        ;;

        *)
            echo " Unknown option: $1"
            echo
        ;;
    esac

    echo
    exit 0
}

# ### CLI parsing ###
debugMsg "CLI parsing"

# Test number of arguments
if [ $# -eq 0 ]
then
    cliHelp
fi

# Temp variables for parser
WnotDefined=true
HnotDefined=true
SourceNotDefined=true
ResDirNotDefined=true
ExtNotDefined=true

# Arguments parsing
while [[ $# > 0 ]] # cmd tools
do
    debugMsg "Parsing key: $1"
    key="$1"    # Get current key
    case $key in    # Do key work

        -i|--in)
            imageSource="$2"
            SourceNotDefined=false
            shift # past argument
        ;;

        -o|--out)
            resultDir="$2"
            ResDirNotDefined=false
            shift # past argument
        ;;

        -e|--extension)
            resultExt="$2"
            ExtNotDefined=false
            shift # past argument
        ;;

        -w|--width)
            tileW="$2"
            if $HnotDefined
            then
                tileH="$2"  # Set h=w by default, if it not defined yet
            fi
            WnotDefined=false
            shift # past argument
        ;;

        -h|--height)
            tileH="$2"
            if $WnotDefined
            then
                tileW="$2"  # Set w=h by default, if it not defined yet
            fi
            HnotDefined=false
            shift # past argument
        ;;

        -s|--step)
            step="$2"
            shift # past argument
        ;;

        -l|--overlap)
            overlap="$2"
            shift # past argument
        ;;

        -p|--options)
            imOptions="$2"
            shift # past argument
        ;;

        -g|--gravity)
            gravity="$2"
            shift # past argument
        ;;

        -x|--extent)
            extent=true
        ;;

        -d|--dzi)
            dziFormat=true
        ;;

        -a|--slicea)
            scaleFromImage=true
        ;;

        -b|--sliceb)
            scaleFromImage=false
        ;;

        -c|--scaleover)
            scaleover=false
        ;;

        -r|--horizontal)
            horizontal=true
        ;;

        -t|--vertical)
            horizontal=false
        ;;

        -v|--verbose)
            verboseLevel="$2"
            shift # past argument
        ;;

        -v0|--verbose0)
            verboseLevel=0
        ;;

        -v1|--verbose1)
            verboseLevel=1
        ;;

        -v2|--verbose1)
            verboseLevel=2
        ;;

        -v3|--verbose1)
            verboseLevel=3
        ;;

        -u|--usage)
            uHelp
            exit 0
        ;;

        -\?|--help)
            cliHelp "$2"
            shift # past argument
        ;;

        -m|--man)
            cliHelp "" true
        ;;

        # --default)
        #     DEFAULT=YES
        # ;;

        *)
            if $SourceNotDefined    # Interpreting first unknown command as source
            then
                imageSource="$1"
                SourceNotDefined=false
            else
                if $ResDirNotDefined    # Interpreting second unknown command as source
                then
                    resultDir="$1"
                    ResDirNotDefined=false
                else                    # Interpreting third unknown command as unknown command
                    echo "Unknown option: $1"
                fi
            fi
        ;;
    esac

    shift # Get next key
done

# Cheking for installed applications
command -v convert >/dev/null 2>&1 || { echo >&2 "I require ImageMagick tool 'convert', but it's not installed. Aborting."; exit 1; }
command -v identify >/dev/null 2>&1 || { echo >&2 "I require ImageMagick tool 'identify', but it's not installed. Aborting."; exit 1; }

# Checking if file was defined
if $SourceNotDefined
then
    echo "No source file present. Canceled."
    exit 1
fi

# Cheking if source file not exists
if [ ! -f "$imageSource" ]
then
    echo "Error! Input file 'images source' not found! File path: $imageSource"
    exit 1
fi

# Set extension
fullName=$(basename "$imageSource")
fileBase="${fullName%.*}"
fileExt="${fullName##*.}"

if $ExtNotDefined
then
    resultExt="$fileExt"
fi

# Set out name
if $ResDirNotDefined
then
    resultDir="$fileBase"
fi

# ———————————————————————————————————————————————————————————————————————————————————
# ####### Functions ####### #
debugMsg "Section: Functions"

getImgW(){ # image_file
    echo `identify -format "%[fx:w]" $1`
}

getImgH(){ # image_file
    echo `identify -format "%[fx:h]" $1`
}

# ———————————————————————————————————————————————————————————————————————————————————
# ######################## #
# ####### Slicer A ####### #
debugMsg "Section: Slicer A"

# Constants
scaleBase=100                   # Scale in percents - 100% (TODO: add option to use image sizes)
scaleMult=100000                # Scale multiplier (bash works only with int)
scaleMult64=100000000000000     # Scale multiplier for x64 bash and x64 convert (if you have very many zoom level and need more accuracy)
scaleStart=0
# declare -a scaledW
# declare -a scaledH
# scaledW=()
# scaledH=()

setScale(){
    if $scale64
    then
        local arch=`uname -m`
        if [ "${arch}" == "x86_64"  ]
        then
            scaleMult=$scaleMult64
        else
            echo "Your system (${arch}) isn't x86_64"
            exit 1
        fi
    fi
    scaleStart=$(( $scaleBase * $scaleMult ))
}

getZoomLevels(){ # imgLen(pixels) tileLen(pixels) step(int) # Calculate zoom levels for current step
    local imgLen=$1
    local tileLen=$2
    local zoomStep=$3
    local r=(0)
    local cnt=1

    # Drop zooms less tile size
    # while [ "$imgLen" -gt "$tileLen" ]
    # do
    #     r[$cnt]=$imgLen
    #     let "cnt+=1"
    #     let "imgLen = imgLen * 100 / zoomStep"
    # done

    # Do all zooms down to 1x1 px
    while [ "$imgLen" -ge 1 ]
    do
        r[$cnt]=$imgLen
        let "cnt+=1"
        let "imgLen = imgLen * 100 / zoomStep"
    done

    r[$cnt]=$imgLen
    r[0]=$cnt
    echo ${r[*]}
}

nextScale(){ # oldScale -> newScale
    # Calculate image zoom in percents - it need for imagemagick for image resize
    echo $(( $1 * 100 / $step ))
}

scaleToPercents(){ # scale
    local s=$1
    local sInt=0
    local sFloat=0
    let "sInt = s / $scaleMult"
    let "sFloat = s - sInt * $scaleMult"
    echo "${sInt}.${sFloat}%"
}

# scaleImage(){ # zoom scale -> file_path
#     local zoom=$1
#     local s=$2
#     local dir="${resultDir}/${zoom}"
#     local file="${dir}.${resultExt}"
#     local size=`scaleToPercents $s`
#     mkdir -p $dir   # Imagemagick can't create directories
#     convert $imageSource $resizeFilter -resize $size $file
#     echo $file
# }

zoomImage(){ # zoom size -> file_path
    local zoom=$1
    local size=$2
    local dir="${resultDir}/${zoom}"
    local file="${dir}.${resultExt}"
    # local file="${dir}.png"
    # local size=`scaleToPercents $s`
    mkdir -p $dir   # Imagemagick can't create directories
    convert $imageSource $resizeFilter -resize $size $imOptions $file
    echo $file
}

sliceImage(){ # zoom image
    local zoom=$1
    local src=$2
    local wxh="${tileW}x${tileH}"

    local xyDelim='/'
    if $dziFormat
    then
        xyDelim='_'
    fi

    local tilesFormat="%[fx:page.x/${tileW}]${xyDelim}%[fx:page.y/${tileH}]" # This very important magic! It allow imagemagick to generate tile names with it position and place it in corect folders (but folders need to generate manually)
    local file="${resultDir}/${zoom}/%[filename:tile].${resultExt}"

    if [ ! $dziFormat ]
    then
        # Creating subdirectories for tiles (one vertical line of tiles is in one folder)
        local srcSize=`getImgW $src`            # Getting image width
        local dirNum=$(( $srcSize / $tileW ))   # Calculating number of tiles in line
        local i=0
        for(( i=0; i<=$dirNum; i++ ))
        do
            mkdir -p "${resultDir}/${zoom}/$i"  # Imagemagick can't create directories
        done
        sync
    fi

    # extent option
    local ext=''
    if $extent
    then
        ext="-background none -extent ${wxh}"
    fi

    # Slice image to tiles
    # convert $src -crop $wxh -set filename:tile $tilesFormat +repage +adjoin -background none -gravity $gravity $ext $file
    convert $src -gravity $gravity -crop $wxh -set filename:tile $tilesFormat +repage +adjoin -gravity $gravity $ext $file
}

sliceA(){
    infoMsg " Slicer A is running..."
    local scalesW=( `getZoomLevels $imageW $tileW $step` )  # Get width  for each zoom level
    local scalesH=( `getZoomLevels $imageH $tileH $step` )  # Get height for each zoom level
    local zw=${scalesW[0]}  # Get zoom level for width
    local zh=${scalesH[0]}  # Get zoom level for height
    local scales=()         # Creating empty array
    local zoomMax=0
    local zoom=0
    local hMod=''
    local s=0
    local file=''

    if [ "$zw" -ge "$zh" ]
    then
        zoomMax=$zw
        scales=( ${scalesW[*]} )
        hMod=''
    else
        zoomMax=$zh
        scales=( ${scalesH[*]} )
        hMod='x'
    fi

    # local scale=$scaleStart
    # local scalep=''
    while [ "$s" -lt "$zoomMax" ]
    do
        if $zoomReverse
        then
            let "zoom = s"
        else
            let "zoom = zoomMax - s"
        fi

        infoMsg "    Resizing next file..."
        debugMsg "    zoomMax=$zoomMax, zoomLevel=$s, wxhInex=$zoom, wxh=${hMod}${scales[$zoom]}"
        file=`zoomImage $s "${hMod}${scales[$zoom]}"`
        infoMsg "    File resized: ${file}"
        infoMsg "    Slicing file..."
        sliceImage $s $file
        rm -rf $file

        # scalep=`scaleToPercents $scale`
        # s=${scales[zoom-1]}
        # echo $zoom "$s"
        # file=`scaleImage $zoom "${hMod}${scales[$zoom]}"`
        # echo "zoom, scalep, scale: $zoom $scalep $scale $file"
        # echo ${scaledW[$i]}
        # echo ${scaledH[$i]}
        # scale=`nextScale $scale`

        let "s+=1"
    done

    infoMsg " Slicer A complete"

    # s=`nextScale $scaleStart`
    # s=`nextScale $s`
    # scaleToPercents $s
}

# ———————————————————————————————————————————————————————————————————————————————————
# ##########################
# ####### Slicer B ####### #
debugMsg "Section: Slicer B"

zoomPixels(){ # zoom tileSize
    local zoom=$1
    local pixels=$2
    if [ "$zoom" -ne 0 ]
    then
        let "pixels = pixels * 100"
        for(( i=0; i<zoom; i++ ))
        do
            let "pixels = pixels * $step / 100"
        done
        let "pixels = pixels / 100"
    fi
    echo $pixels
}

resizeImageH(){ # zoom -> file_path
    local zoom=$1
    local dir="${resultDir}/${zoom}"
    local file="${dir}.${resultExt}"
    local size=`zoomPixels $zoom $tileW`
    mkdir -p $dir   # Imagemagick can't create directories
    convert $imageSource $resizeFilter -resize $size $imOptions $file
    echo $file
}

resizeImageV(){ # zoom -> file_path
    local zoom=$1
    local dir="${resultDir}/${zoom}"
    local file="${dir}.${resultExt}"
    local size=`zoomPixels $zoom $tileH`
    mkdir -p $dir   # Imagemagick can't create directories
    convert $imageSource $resizeFilter -resize "x${size}" $imOptions $file
    echo $file
}

resizeImage(){ # zoom -> file_path
    if $horizontal
    then
        echo `resizeImageH $1`
    else
        echo `resizeImageV $1`
    fi
}

sliceB(){
    echo "Slicer B is running..."
    local size=0
    local sizeMax=0
    local zoom=0

    if $horizontal
    then
        let "size = $tileW"
        let "sizeMax = $imageW"
    else
        let "size = $tileH"
        let "sizeMax = $imageH"
    fi

    if $scaleover
    then
        let "sizeMax += $size"
    fi

    local px=$size
    while [ "$px" -lt "$sizeMax" ]
    do
        echo "    Slicing zoom level \"${zoom}\"; image main size is \"${px}\""
        sliceImage $zoom `resizeImage $zoom`
        let "zoom++"
        px=`zoomPixels $zoom $size`
    done
    echo "Slicer B complete"
}


mainScale(){ # min zoom = tile width
    if $scaleFromImage
    then
        sliceA
    else
        sliceB
    fi
    echo
}

setDziFormat(){
    local dziFileName="${resultDir}.dzi"
    resultDir="${resultDir}_files"
    tileH=$tileW
    echo '<?xml version="1.0"?>' > "$dziFileName"
    echo "<Image TileSize=\"${tileW}\" Overlap=\"0\" Format=\"${resultExt}\" xmlns=\"http://schemas.microsoft.com/deepzoom/2008\">" >> "$dziFileName"
    echo "<Size Width=\"${imageW}\" Height=\"${imageH}\"/>" >> "$dziFileName"
    echo '</Image>' >> "$dziFileName"
    # <?xml version="1.0"?>
    #
    #
    # </Image>
}

setFormat(){
    if $dziFormat
    then
        setDziFormat
    fi
}

init(){
    if [ "$step" -le 100 ]
    then
        echo "You get infinity loop. Minimum step value = 101% (101)"
        exit 1
    fi
    # Getting image sizes
    imageW=`getImgW $imageSource`
    imageH=`getImgH $imageSource`

    # Set options for selected format
    setFormat

    # Set scale
    setScale

    rm -rf $resultDir   # removing old results
    mkdir -p $resultDir # creating new results folder

}

# ———————————————————————————————————————————————————————————————————————————————————
# ###################### #
# ### Programm start ### #
debugMsg "Section: Programm"

init
mainScale

# ### Programm end ##### #
# ###################### #
# ———————————————————————————————————————————————————————————————————————————————————
