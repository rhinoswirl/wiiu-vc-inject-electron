#!/bin/bash
RUN_COMMAND=${1:-'java -jar ../jar/JNUSTool.jar'}
TITLE_KEY=${2:-'00000000000000000000000000000000'}

#if [ ! -f /tmp/foo.txt ]; then
#  echo "File not found!"
#fi

bash -c "$RUN_COMMAND 0005001010004000 -file /code/deint.txt"
bash -c "$RUN_COMMAND 0005001010004000 -file /code/font.bin"
bash -c "$RUN_COMMAND 0005001010004001 -file /code/c2w.img"
bash -c "$RUN_COMMAND 0005001010004001 -file /code/boot.bin"
bash -c "$RUN_COMMAND 0005001010004001 -file /code/dmcu.d.hex"
bash -c "$RUN_COMMAND 00050000101b0700 $TITLE_KEY -file /code/cos.xml"
bash -c "$RUN_COMMAND 00050000101b0700 $TITLE_KEY -file /code/frisbiiU.rpx"
bash -c "$RUN_COMMAND 00050000101b0700 $TITLE_KEY -file /code/fw.img"
bash -c "$RUN_COMMAND 00050000101b0700 $TITLE_KEY -file /code/fw.tmd"
bash -c "$RUN_COMMAND 00050000101b0700 $TITLE_KEY -file /code/htk.bin"
bash -c "$RUN_COMMAND 00050000101b0700 $TITLE_KEY -file /code/nn_hai_user.rpl"
bash -c "$RUN_COMMAND 00050000101b0700 $TITLE_KEY -file /content/assets/.*"
bash -c "$RUN_COMMAND 00050000101b0700 $TITLE_KEY -file /meta/bootMovie.h264"
bash -c "$RUN_COMMAND 00050000101b0700 $TITLE_KEY -file /meta/bootLogoTex.tga"
bash -c "$RUN_COMMAND 00050000101b0700 $TITLE_KEY -file /meta/bootSound.btsnd"
