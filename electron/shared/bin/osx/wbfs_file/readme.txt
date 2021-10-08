
wbfs_file v1.4 by oggzee
========================

Based on wbfs tool by kwiirk and wbfs_win by hermes


New functionality:
------------------
(compared to original wbfs by kwiirk)

* Conversion from .iso files to .wbfs files and vice versa.

* Handling of split .wbfs files, so that they can fit on a FAT filesystem.
  by default the split is done at 2GB - 1 sector (512 bytes)

* Extraction of .wbfs files directly from a wbfs partition and back


Changes:
--------

v1.4:
 * fixed -1 option for 1:1 copy.
   Note, a 1:1 copy will still scrub the last 256kb, because the wbfs
   block size (2 mb) is not aligned to the wii disc size (4699979776 b)
   However everything else is copied as is without scrubbing.
 * Replace also ? and * with _ when making a filename from title
 * make_info will create the .txt file in the same directory as the
   source .wbfs file unless the argument is a device, then the .txt
   files are created in the current dir.
 * Indicate in the help message which parameters are source (SRC:)
   and which are destination (DST:) in the first column, the parameter
   is a source unless DST: specified 
 * Added command: 'convert' which is the same as running the tool with
   just a filename, but it accepts a destination directory. Example:
     wbfs_file c:\wii\game.iso convert e:\wbfs
   will conver to e:\wbfs\GAMEID.wbfs
   While the single file parameter variant:
     wbfs_file c:\wii\game.iso
   will convert to c:\wii\GAMEID.wbfs

v1.3:
 * Fixed extracted iso size on Windows
 * Fixed ETA info for iso extraction

v1.2:
 * On Windows allow to use device name instead of drive letter in the format:
   \\?\GLOBALROOT\Device\Harddisk3\Partition2
   This is useful if you don't have a drive letter assigned to a partition

v1.1:
 * Added options:
    -a       :  Copy ALL partitions from ISO [default]
    -g       :  Copy only game partition from ISO
    -1       :  Copy 1:1 from ISO
   (Note: it's recommended to just use the defaults)

v1.0:
 * renamed commands for better clarity
   example: extractwbfsall to extract_wbfs_all ...

 * create GAMEID_TITLE.txt info files along GAMEID.wbfs files, so
   that it's easier to manage the .wbfs files

 * added command: make_info which only creates the GAMEID_TITLE.txt for
   all games on a wbfs partition or in a wbfs file

v0.9:
 * initial wbfs_file release with split file support


Usage help text as printed by wbfs_file -h :
--------------------------------------------

wbfs_file.exe 1.4 by oggzee, based on wbfs by kwiirk

Usage: wbfs_file.exe [OPTIONS] <DRIVE or FILENAME> [COMMAND [ARGS]]:

  Given just a filename it will convert from iso to wbfs or vice versa:

    wbfs_file.exe filename.iso
    Will convert filename.iso to GAMEID.wbfs
    And create an info file GAMEID_TITLE.txt

    wbfs_file.exe filename.wbfs
    Will convert filename.wbfs to GAMEID_TITLE.iso

  COMMANDS:
        <filename.iso>   convert  <DST:dir>
        <filename.wbfs>  convert  <DST:dir>
    <DST:filename.wbfs>  create   <SRC:filename.iso>
        <drive or file>  ls               
        <drive or file>  df               
        <drive or file>  make_info        
    <DST:drive or file>  init             
    <DST:drive or file>  add_iso          <SRC:filename.iso>
    <DST:drive or file>  add_wbfs         <SRC:filename.wbfs>
    <DST:drive or file>  rm               <GAMEID>
        <drive or file>  extract_iso      <GAMEID> <DST:dir>
        <drive or file>  extract_wbfs     <GAMEID> <DST:dir>
        <drive or file>  extract_wbfs_all <DST:dir>
        <drive or file>  ls_file          <GAMEID>
        <drive or file>  extract_file     <GAMEID> <DST:file>

  OPTIONS: (it's recommended to just use the defaults)
    -s SIZE  :  Set split size [2147483136] (4194303 sectors)
                  Must be a multiple of 512 (sector size)
    -a       :  Copy ALL partitions from ISO [default]
    -g       :  Copy only game partition from ISO
    -1       :  Copy 1:1 from ISO
    -h       :  Help

