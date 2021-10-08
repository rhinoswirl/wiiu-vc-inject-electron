#!/bin/bash

convert -resize 128x128! -alpha on iconTex.png iconTex.tga
convert -resize 1280x720! -alpha off bootTvTex.png bootTvTex.tga
convert -resize 854x480! -alpha off bootTvTex.png bootDrcTex.tga
