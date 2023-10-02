"use client"
import clsx from 'clsx';
import Image from 'next/image'
import { useState, useRef } from 'react';
import { HexColorPicker } from "react-colorful";
import { CgColorPicker } from 'react-icons/cg'
import domtoimage from 'dom-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Switch } from "@/components/ui/switch"
import { BsYoutube, BsInstagram, BsFillLightningChargeFill, BsStars, BsFillCloudFill, BsFillCursorFill, BsFillEyeFill, BsFillPersonFill } from 'react-icons/bs'

interface Icon {
  id: number;
  icon: JSX.Element;
  name: string;
}

export default function Home() {
  const [bgColor, setBgColor] = useState<string>("#8ea0c1");
  const [color, setColor] = useState<string>("#ffffff");
  const [badgeText, setBadgeText] = useState<string>("graphiccord");
  const [badgeRound, setBadgeRound] = useState<string>("40");
  const [isIconVisible, setIconVisibility] = useState<boolean>(true);
  const [isIconMenuVisible, setIconMenuVisibility] = useState<boolean>(false);
  const [iconSearch, setIconSearch] = useState<string>("");

  const [activePicker, setActivePicker] = useState<string | null>(null);

  const bgPickerRef = useRef<HTMLDivElement>(null);
  const textPickerRef = useRef<HTMLDivElement>(null);
  const bgIconRef = useRef<HTMLDivElement>(null);
  const textColorIconRef = useRef<HTMLDivElement>(null);

  const toggleBgPicker = () => {
    if (activePicker === 'bg') {
      setActivePicker(null);
    } else {
      setActivePicker('bg');
    }
  };
  
  const toggleTextPicker = () => {
    if (activePicker === 'text') {
      setActivePicker(null);
    } else {
      setActivePicker('text');
    }
  };

  const downloadDivAsImage = async () => {
    const node = document.getElementById("capture");
    
    if (node) {
      const blob = await domtoimage.toBlob(node);
      const img = new window.Image();

      img.src = URL.createObjectURL(blob);
      
      await new Promise(resolve => img.onload = resolve);
      
      const totalWidth = img.width;
      const height = img.height;
      const partWidth = 64; // Each part will be 64 pixels wide
      const numberOfParts = Math.ceil(totalWidth / partWidth); // Calculate the number of parts
      const extraWidth = totalWidth % partWidth; // Calculate extra width
      const addedWidthPerPart = Math.floor(extraWidth / numberOfParts); // Distribute extra width equally
      
      const blobs = [];
      
      for (let i = 0; i < numberOfParts; i++) {
        const tempCanvas = document.createElement('canvas');
        const currentPartWidth = partWidth + addedWidthPerPart;
        
        tempCanvas.width = currentPartWidth;
        tempCanvas.height = height;
        const ctx = tempCanvas.getContext('2d');
        
        if (ctx) {
          ctx.drawImage(img, i * currentPartWidth, 0, currentPartWidth, height, 0, 0, currentPartWidth, height);
          const partBlob = await new Promise(resolve => tempCanvas.toBlob(resolve));
          blobs.push(partBlob);
        }
      }
      
      const zip = new JSZip();
      blobs.forEach((blob, index) => {
        zip.file(`${index + 1}.png`, blob as Blob);
      });
      
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, badgeText + ".zip");
    }
  }

  const icons = [
    {
      id: 1,
      icon: <BsYoutube size={25}/>,
      name: 'YouTube'
    },
    {
      id: 2,
      icon: <BsInstagram size={25}/>,
      name: 'Instagram'
    },
    {
      id: 3,
      icon: <BsFillLightningChargeFill size={25}/>,
      name: 'Lightning'
    },
    {
      id: 4,
      icon: <BsStars size={25}/>,
      name: 'Stars'
    },
    {
      id: 5,
      icon: <BsFillCloudFill size={25}/>,
      name: 'Cloud'
    },
    {
      id: 6,
      icon: <BsFillCursorFill size={25}/>,
      name: 'Cursor'
    },
    {
      id: 7,
      icon: <BsFillEyeFill size={25}/>,
      name: 'Eye'
    },
    {
      id: 8,
      icon: <BsFillPersonFill size={25}/>,
      name: 'Person'
    },
  ]

  const [selectedIcon, setSelectedIcon] = useState(icons[0].icon);

  return (
    <>
      {/* Navbar */}
      <div className='flex justify-between p-10'>
        <div className='flex items-center gap-2'>
          <Image src={'/logo.svg'} alt='logo' width={25} height={0}/>
          <h1 className='text-xl font-semibold'>graphiccord</h1>
        </div>
        <button className='bg-white text-black font-medium px-3 py-2 rounded-xl'>
          Donate
        </button>
      </div>

      <div className='flex flex-col justify-center items-center '>
        <div className='py-10 px-1 w-[300px] transparent rounded-xl m-5 flex justify-center'>
          <div id="capture" className='flex gap-2 px-4 py-1 justify-center items-center min-w-[200px] h-[64px] scale-90' style={{ backgroundColor: bgColor, borderRadius: badgeRound + 'px', color: color }}>
          {isIconVisible && selectedIcon}

            <h1 className='font-medium text-2xl truncate'>{badgeText}</h1>
          </div>
        </div>

        <div className='bg-[#212225] p-4 rounded-xl w-[300px]'>
          <h1 className='text-[#949EA0] uppercase'>Text</h1>
          <input 
            placeholder='Badge Text' 
            className='bg-[#16171A] rounded-md px-3 py-2 placeholder:text-[#646465] mb-5'
            value={badgeText} // Set the input value to badgeText
            onChange={(e) => setBadgeText(e.target.value)} // Update badgeText on input change
          />

          <h1 className='text-[#949EA0] uppercase'>Rounded</h1>
          <input 
            placeholder='0' 
            className='bg-[#16171A] rounded-md px-3 py-2 placeholder:text-[#646465] mb-5'
            value={badgeRound} // Set the input value to badgeText
            onChange={(e) => setBadgeRound(e.target.value)} // Update badgeText on input change
          />

          <h1 className='text-[#949EA0] uppercase'>Colors</h1>

          <div className='flex gap-2 w-full mt-3'>
            <div className='w-full' ref={bgPickerRef}>
              <p className='text-[#7B7B7B] text-sm'>BACKGROUND</p>
              <div style={{ backgroundColor: bgColor }} className='p-2 flex justify-center rounded-md cursor-pointer' onClick={toggleBgPicker} ref={bgIconRef}>
                <CgColorPicker />
              </div>
              {activePicker === 'bg' && (
                <div className='absolute my-3'>
                  <HexColorPicker color={bgColor} onChange={setBgColor}/>
                </div>
              )}
            </div>

            <div ref={textPickerRef}>
              <p className='text-[#7B7B7B] text-sm'>TEXT</p>
                <div style={{ backgroundColor: color }} className='p-2 flex justify-center rounded-md cursor-pointer' onClick={toggleTextPicker} ref={textColorIconRef}>
                  <CgColorPicker />
                </div>
              {activePicker === 'text' && (
                <div className='absolute my-3 right-0 md:right-auto mx-5'>
                  <HexColorPicker color={color} onChange={setColor}/>
                </div>
              )}
            </div>
        </div>

        <div className='flex justify-between items-center mt-5'>
          <div className='flex gap-2'>
            <h1 className='text-[#949EA0] uppercase'>ICON</h1>
            <Switch checked={isIconVisible} onCheckedChange={() => setIconVisibility(!isIconVisible)}/>
          </div>

          <div className='border border-[#353639] rounded-md p-2 cursor-pointer transition-all hover:bg-white/10' onClick={() => setIconMenuVisibility(!isIconMenuVisible)}>
          {selectedIcon}

          </div>

          <div className={clsx('bg-[#24272b] border border-[#36383B] right-[110px] md:right-[780px] p-2 rounded-xl absolute flex flex-col', 
            { 'hidden': !isIconMenuVisible })}>
            <input 
            placeholder='Search for an icon' 
            className='bg-[#16171A] rounded-md px-3 py-2 placeholder:text-[#646465] mb-5'
            value={iconSearch} // Set the input value to badgeText
            onChange={(e) => setIconSearch(e.target.value)} // Update badgeText on input change
          />
            <div className='h-[100px] flex flex-col flex-wrap items-start'>
              {icons.filter(icon => icon.name.toLowerCase().includes(iconSearch.toLowerCase())).map((icon) => (
                <div 
                  className='border border-[#353639] rounded-md p-1 m-1 cursor-pointer transition-all hover:bg-white/10 w-fit'
                  onClick={() => {
                    setSelectedIcon(icon.icon);
                    setIconMenuVisibility(false);  // Close the menu after selecting an icon
                  }}>
                  {icon.icon}
                </div>
              ))}
            </div>
          </div>
        </div>

        <button className='bg-[#5AA55B] w-full p-2 mt-5 rounded-md font-semibold' onClick={downloadDivAsImage}>
          Download as .zip
        </button>

        </div>
      </div>
    </>
  )
}