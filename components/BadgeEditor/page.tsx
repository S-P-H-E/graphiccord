"use client"
import clsx from 'clsx';
import { useState, useEffect, useRef, SetStateAction } from 'react';
import { HexColorPicker } from "react-colorful";
import domtoimage from 'dom-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import * as bs from 'react-icons/bs';
import { CgColorPicker } from 'react-icons/cg'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import icons from '@/components/icons';


interface Icon {
    id: number;
    icon: JSX.Element;
    name: string;
  }


export default function BadgeEditor(){
    const [bgColor, setBgColor] = useState<string>("#000000");
    const [color, setColor] = useState<string>("#ffffff");
    const [badgeText, setBadgeText] = useState<string>("DISCORD");
    const [badgeRound, setBadgeRound] = useState<string>("40");
    const [textSpacing, setTextSpacing] = useState<number>(1);
    const [isIconVisible, setIconVisibility] = useState<boolean>(true);
    const [isIconMenuVisible, setIconMenuVisibility] = useState<boolean>(false);
    const [iconSearch, setIconSearch] = useState<string>("");

    useEffect(() => {
        adjustWidth();
    }, [badgeText, isIconVisible]);

    const adjustWidth = () => {
        const captureDiv = document.getElementById("capture");

        if (captureDiv) { // Check if captureDiv is not null
            // Temporarily reset the width to natural content width
            captureDiv.style.width = 'auto';

            // Calculate the width of the content inside the "capture" div
            const contentWidth = captureDiv.scrollWidth;

            // Round the width to the nearest multiple of 32px
            const roundedWidth = Math.ceil(contentWidth / 32) * 32;

            // Set the width of the "capture" div to the rounded value
            captureDiv.style.width = `${roundedWidth}px`;
        }
    };




  const bgPickerRef = useRef<HTMLDivElement>(null);
  const textPickerRef = useRef<HTMLDivElement>(null);
  const bgIconRef = useRef<HTMLDivElement>(null);
  const textColorIconRef = useRef<HTMLDivElement>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const iconsPerPage = 24; // Number of icons per page

  // Filter icons based on search
  const filteredIcons = Object.entries(bs).filter(([name]) =>
    name.toLowerCase().includes(iconSearch.toLowerCase())
  );

  // Paginate icons
  const indexOfLastIcon = currentPage * iconsPerPage;
  const indexOfFirstIcon = indexOfLastIcon - iconsPerPage;
  const currentIcons = filteredIcons.slice(indexOfFirstIcon, indexOfLastIcon);

  const [selectedIcon, setSelectedIcon] = useState(icons[0].icon);

  // Change page
  const paginate = (pageNumber: SetStateAction<number>) => setCurrentPage(pageNumber);

  const downloadDivAsImage = async () => {
    const node = document.getElementById("capture");
    
    if (node) {

      const blob = await domtoimage.toBlob(node);
      const img = new window.Image();

      img.src = URL.createObjectURL(blob);
      
      await new Promise(resolve => img.onload = resolve);
      
      const totalWidth = img.width;
      const height = img.height;
      const size = Math.min(totalWidth, height); // Use the smaller dimension as the size for 1:1 aspect ratio
      const numberOfParts = Math.ceil(totalWidth / size); // Calculate the number of parts
      
      const blobs = [];
      
      for (let i = 0; i < numberOfParts; i++) {
        const tempCanvas = document.createElement('canvas');
        
        tempCanvas.width = size;
        tempCanvas.height = size;
        const ctx = tempCanvas.getContext('2d');
        
        if (ctx) {
          ctx.drawImage(img, i * size, 0, size, size, 0, 0, size, size);
          const partBlob = await new Promise(resolve => tempCanvas.toBlob(resolve));
          blobs.push(partBlob);
        }
      }
      
      const zip = new JSZip();
      blobs.forEach((blob, index) => {
        zip.file(`${index}.png`, blob as Blob);
      });
      
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, badgeText + ".zip");
    }
}




    return(
        <>
            <div className='flex flex-col justify-center items-center absolute top-[400px] md:top-[500px]'>
                <div className='py-10 px-1 w-[300px] transparent rounded-xl m-5 flex justify-center shadow-2xl'>
                    <div id="capture" className='flex gap-2 px-2 py-1 justify-center items-center min-w-[32px] h-[32px]' style={{ backgroundColor: bgColor, borderRadius: badgeRound + 'px', color: color, letterSpacing: `${textSpacing}px`}}>
                        {isIconVisible && selectedIcon}
                        <h1 className='font-medium text-xl'>{badgeText}</h1>
                    </div>
                </div>

                <div className='bg-[#212225] p-4 rounded-xl w-[300px] shadow-2xl flex flex-col gap-5'>
                <div>
                    <h1 className='text-[#949EA0] uppercase'>Text</h1>
                    <input 
                        placeholder='Badge Text' 
                        className='bg-[#16171A] rounded-md px-3 py-2 placeholder:text-[#646465] w-full'
                        value={badgeText} // Set the input value to badgeText
                        onChange={(e) => setBadgeText(e.target.value)} // Update badgeText on input change
                    />
                </div>

                <div>
                    <h1 className='text-[#949EA0] uppercase'>Rounded</h1>
                    <input 
                        placeholder='0' 
                        className='bg-[#16171A] rounded-md px-3 py-2 placeholder:text-[#646465] w-full'
                        value={badgeRound} // Set the input value to badgeText
                        onChange={(e) => setBadgeRound(e.target.value)} // Update badgeText on input change
                    />
                </div>

                <div>
                    <h1 className='text-[#949EA0] uppercase'>Spacing</h1>
                    <Slider 
                    defaultValue={[1]} 
                    max={15} 
                    step={1}
                    onValueChange={(value) => setTextSpacing(value[0])}
                />
                </div>

                <div>
                    <h1 className='text-[#949EA0] uppercase'>Colors</h1>
                    <div className='flex gap-2 w-full mt-3'>
                        <div className='w-full' ref={bgPickerRef}>
                            <p className='text-[#7B7B7B] text-sm'>BACKGROUND</p>
                            <div className='flex gap-2'>
                                
                                <DropdownMenu>
                                    <DropdownMenuTrigger className='w-full outline-none'>
                                        <div style={{ backgroundColor: bgColor }} className='p-2 flex justify-center items-center rounded-md cursor-pointer w-full' ref={bgIconRef}>
                                            <CgColorPicker className={bgColor === '#ffffff' ? 'invert' : ''}/>
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <HexColorPicker color={bgColor} onChange={setBgColor}/>
                                        <DropdownMenuLabel>
                                            <div className='flex justify-between items-center mt-5'>
                                                <p className='text-[#7B7B7B] text-sm'>HEX</p>
                                                <input 
                                                    placeholder='Hex Code' 
                                                    className='bg-[#16171A] rounded-md px-3 py-2 placeholder:text-[#646465] w-[100px] text-[--highlight]'
                                                    value={bgColor} // Set the input value to badgeText
                                                    onChange={(e) => setBgColor(e.target.value)} // Update badgeText on input change
                                                />
                                            </div>
                                        </DropdownMenuLabel>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                
                            </div>
                        </div>

                        <div className='w-full' ref={textPickerRef} >
                            <p className='text-[#7B7B7B] text-sm'>TEXT</p>
                            <div className='flex gap-2'>
                                
                                <DropdownMenu>
                                    <DropdownMenuTrigger className='w-full outline-none'>
                                        <div style={{ backgroundColor: color}} className='p-2 flex justify-center items-center rounded-md cursor-pointer w-full' ref={textColorIconRef}>
                                            <CgColorPicker className={color === '#ffffff' ? 'invert' : ''}/>
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <HexColorPicker color={color} onChange={setColor}/>
                                        <DropdownMenuLabel>
                                            <div className='flex justify-between items-center mt-5'>
                                                <p className='text-[#7B7B7B] text-sm'>HEX</p>
                                                <input 
                                                    placeholder='Hex Code' 
                                                    className='bg-[#16171A] rounded-md px-3 py-2 placeholder:text-[#646465] w-[100px] text-[--highlight]'
                                                    value={color} // Set the input value to badgeText
                                                    onChange={(e) => setColor(e.target.value)} // Update badgeText on input change
                                                />
                                            </div>
                                        </DropdownMenuLabel>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='flex justify-between items-center'>
                <div className='flex gap-2'>
                    <h1 className='text-[#949EA0] uppercase'>ICON</h1>
                    <Switch checked={isIconVisible} onCheckedChange={() => setIconVisibility(!isIconVisible)}/>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <div className='border border-[#353639] rounded-md p-2 cursor-pointer transition-all hover:bg-white/10'>
                            {selectedIcon}
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>
                            <input 
                                placeholder='Search for an icon' 
                                className='bg-[#16171A] rounded-md px-3 py-2 placeholder:text-[#646465] mb-5 text-[--highlight] w-full'
                                value={iconSearch} // Set the input value to badgeText
                                onChange={(e) => setIconSearch(e.target.value)} // Update badgeText on input change
                                />
                        </DropdownMenuLabel>
                        <div className='w-[310px] flex flex-row flex-wrap items-start'>
                            {currentIcons.map(([funcName, func], index) => (
                                <DropdownMenuItem
                                key={index}
                                className='border border-[#353639] rounded-md p-2 m-1 cursor-pointer w-fit text-[#acaeae]'
                                onClick={() => {
                                    setSelectedIcon(func({ size: 22 }));
                                    setIconMenuVisibility(false);
                                }}
                                >
                                {func({ size: 22 })}
                                </DropdownMenuItem>
                            ))}
                            </div>
                            <div className='mt-5 flex justify-between items-center'>
                                <button
                                    className={`p-1 rounded-md text-white ${currentPage === 1 ? 'bg-[#3c4043] cursor-not-allowed text-[#6c6c6d]' : 'bg-[#5AA55B]'}`}
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    <bs.BsArrowLeftShort size={30} />
                                </button>
                                <h1 className='text-[#889194]'>
                                    Page {currentPage} of {Math.ceil(filteredIcons.length / iconsPerPage)}
                                </h1>
                                <button
                                    className={`p-1 rounded-md text-white ${currentPage === Math.ceil(filteredIcons.length / iconsPerPage) ? 'bg-[#3c4043] cursor-not-allowed text-[#6c6c6d]' : 'bg-[#5AA55B]'}`}
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === Math.ceil(filteredIcons.length / iconsPerPage)}
                                >
                                    <bs.BsArrowRightShort size={30} />
                                </button>
                            </div>
                    </DropdownMenuContent>
                </DropdownMenu>
                </div>

                <button className='bg-[#5AA55B] w-full p-2 rounded-md font-semibold' onClick={downloadDivAsImage}>
                Download as .zip
                </button>

                </div>
                <p className='text-[#747980] p-10'>Developed by Sphe ©</p>
            </div>
        </>
    )
}