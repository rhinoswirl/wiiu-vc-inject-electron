#!/bin/bash

TITLE_ID_TEXT=${1:-'TitleIDHex'}
PACKED_TITLE_ID_LINE=${2:-'PackedTitleIDLine'}
TITLE_ID_HEX=${3:-'TitleIDHex'}
PACKED_TITLE_LINE1=${4:-'O meu jogo'}
PACKED_TITLE_LINE2=${5:-'A minha descrição'}


sed -i -e 's/REPLACE_WITH_TITLE_ID_TEXT/'"$TITLE_ID_TEXT"'/g' app.xml
sed -i -e 's/REPLACE_WITH_PACKED_TITLE_ID_LINE/'"$PACKED_TITLE_ID_LINE"'/g' app.xml
sed -i -e 's/REPLACE_WITH_TITLE_ID_HEX/'"$TITLE_ID_HEX"'/g' app.xml
sed -i -e 's/REPLACE_WITH_PACKED_TITLE_LINE1/'"$PACKED_TITLE_LINE1"'/g' app.xml
sed -i -e 's/REPLACE_WITH_PACKED_TITLE_LINE2/'"$PACKED_TITLE_LINE2"'/g' app.xml

sed -i -e 's/REPLACE_WITH_TITLE_ID_TEXT/'"$TITLE_ID_TEXT"'/g' meta1line.xml
sed -i -e 's/REPLACE_WITH_PACKED_TITLE_ID_LINE/'"$PACKED_TITLE_ID_LINE"'/g' meta1line.xml
sed -i -e 's/REPLACE_WITH_TITLE_ID_HEX/'"$TITLE_ID_HEX"'/g' meta1line.xml
sed -i -e 's/REPLACE_WITH_PACKED_TITLE_LINE1/'"$PACKED_TITLE_LINE1"'/g' meta1line.xml
sed -i -e 's/REPLACE_WITH_PACKED_TITLE_LINE2/'"$PACKED_TITLE_LINE2"'/g' meta1line.xml

sed -i -e 's/REPLACE_WITH_TITLE_ID_TEXT/'"$TITLE_ID_TEXT"'/g' meta2line.xml
sed -i -e 's/REPLACE_WITH_PACKED_TITLE_ID_LINE/'"$PACKED_TITLE_ID_LINE"'/g' meta2line.xml
sed -i -e 's/REPLACE_WITH_TITLE_ID_HEX/'"$TITLE_ID_HEX"'/g' meta2line.xml
sed -i -e 's/REPLACE_WITH_PACKED_TITLE_LINE1/'"$PACKED_TITLE_LINE1"'/g' meta2line.xml
sed -i -e 's/REPLACE_WITH_PACKED_TITLE_LINE2/'"$PACKED_TITLE_LINE2"'/g' meta2line.xml
