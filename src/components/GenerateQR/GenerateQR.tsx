'use client';

import React, { useState, useRef } from 'react';
import { useQRCode } from 'next-qrcode';
import AppInputField from '../Base/AppInputField';
import AppButton from '../Base/AppButton';
import { useReactToPrint } from 'react-to-print';

const GenerateQR = () => {
  const { Canvas } = useQRCode();
  const serialNoContainer = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => serialNoContainer.current,
  });
  const [serialNo, setSerialNo] = useState('');
  const [arrSerial, setArrSerial] = useState<string[]>([]);
  const [qrIsVisible, setQrIsVisible] = useState(false);

  const handleQrCodeGenerator = () => {
    if (!serialNo) {
      return;
    }
    setQrIsVisible(true);

    let serialNoArr = serialNo.trim().split(',');
    setArrSerial(serialNoArr);
  };

  const serialNoHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSerialNo(event.target.value);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <AppInputField
          title="Serial No"
          value={serialNo}
          inputHandler={serialNoHandler}
          inputProps={{ name: 'contactNumber' }}
          placeholder="Serial No"
        />
        <AppButton
          onClick={handleQrCodeGenerator}
          className="px-6 py-3 max-w-[200px]"
          primary
        >
          Generate QR Code
        </AppButton>
      </div>

      {qrIsVisible && (
        <div className="flex flex-col gap-5 items-center justify-center flex-wrap">
          <div
            className="flex flex-row items-center justify-center flex-wrap p-5 gap-6"
            ref={serialNoContainer}
          >
            {arrSerial.map((sNum, i) => {
              if (!sNum) {
                return;
              }
              return (
                <div
                  key={i}
                  className="flex flex-col items-center gap-1 flex-wrap"
                >
                  <Canvas
                    key={i}
                    text={String(sNum)}
                    options={{
                      errorCorrectionLevel: 'M',
                      margin: 1,
                      scale: 4,
                      width: 280,
                      color: {
                        light: '#F0F0F0',
                      },
                    }}
                  />
                  <div className="bg-white w-full px-2 flex flex-row items-center justify-center rounded">
                    <p className="text-black">Serial No: {sNum}</p>
                  </div>
                </div>
              );
            })}
          </div>
          {arrSerial.length && (
            <AppButton
              onClick={handlePrint}
              className="px-6 py-3 max-w-[200px]"
              primary
            >
              Print QR Code
            </AppButton>
          )}
        </div>
      )}
    </div>
  );
};

export default GenerateQR;
