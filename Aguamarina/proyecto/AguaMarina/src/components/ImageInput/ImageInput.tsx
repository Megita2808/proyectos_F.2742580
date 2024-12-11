import React, { useState, useEffect } from 'react';
import { Upload } from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import { Typography } from '@mui/material';
import ImgCrop from 'antd-img-crop';

interface ImageData {
  uid: string;
  name: string;
  status: string;
  url: string;
}

interface ImageInputProps {
  setImages: (images: ImageData[]) => void;
  clearImages: boolean;
  defaultFileList?: UploadFile[];
}

const ImageInput: React.FC<ImageInputProps> = ({ setImages, clearImages, defaultFileList = [] }) => {
  const [fileList, setFileList] = useState<UploadFile[]>(defaultFileList);
  const [allImages, setAllImages] = useState<ImageData[]>([]);

  // Sync defaultFileList with fileList when defaultFileList changes
  useEffect(() => {
    if(defaultFileList) {
      setFileList(defaultFileList);
    }
  }, []);

  useEffect(() => {
    setImages(allImages);
  }, [allImages, setImages]);

  useEffect(() => {
    if (clearImages) {
      setFileList([]);
      setAllImages([]);
      setImages([]);
    }
  }, [clearImages, setImages]);

  const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as File);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const imgWindow = window.open(src);
    imgWindow?.document.write(`<img src="${src}" style="width: 100%; height: auto;" />`);
  };

  const handleUpload = async ({ file, onSuccess, onError }: any) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://api-aguamarina-mysql-v2.onrender.com/api/v2/images/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.ok) {
        const newImage = { uid: file.uid, name: file.name, status: 'done', url: data.body };
        setAllImages((prevImages) => [...prevImages, newImage]);
        onSuccess?.(data.body, file);
      } else {
        onError?.(new Error('Error uploading image'));
      }
    } catch (error) {
      onError?.(error as Error);
    }
  };

  const onRemove = (file: UploadFile) => {
    setFileList((prevList) => prevList.filter((item) => item.uid !== file.uid));
    setAllImages((prevImages) => prevImages.filter((image) => image.uid !== file.uid));
  };

  return (
    <div className="relative z-50">
      <ImgCrop
        rotationSlider
        showReset
        modalCancel="Cancelar"
        modalOk="Subir"
        modalClassName="backdrop-blur-sm fixed inset-0 items-center text-center justify-center bg-opacity-30 z-50"
        modalTitle="Editar Imagen"
      >
        <Upload
          customRequest={handleUpload}
          listType="picture-card"
          fileList={fileList}
          onChange={onChange}
          onPreview={onPreview}
          onRemove={onRemove}
          itemRender={(originNode, file) => (
            <div className="relative hover:scale-105 duration-300">
              <div className="flex w-full justify-center rounded-[7px] bg-primary p-[13px] font-medium text-white hover:bg-opacity-90">
                {originNode}
              </div>
            </div>
          )}
          className="rounded-lg bg-primary/[.2] dark:bg-white/10 p-6 dark:text-white"
        >
          {fileList.length < 5 && 
            <div className={`bg-dark-8 dark:bg-dark-4 p-7 rounded-xl hover:scale-110 duration-300 border-dashed border-dark border-2 inline-flex items-center justify-center gap-2.5 text-center font-medium hover:bg-opacity-90 text-xl hover:bg-primary dark:hover:bg-primary hover:text-white text-primary `}>
                + Subir
            </div>
          }
        </Upload>
      </ImgCrop>
    </div>
  );
};

export default ImageInput;
