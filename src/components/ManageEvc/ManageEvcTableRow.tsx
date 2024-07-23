'use client';

import React, { FC, useState } from 'react';
import AppSwitch from '../Base/AppSwitch';
import AppImage from '../Base/AppImage';
import AppModal from '../Base/AppModal';
import AppButton from '../Base/AppButton';
import { changeEvcStatus, getEvcByAdmin, getEvcByUser } from '@/services/evc';
import { useAppDispatch } from '@/redux/hooks';
import { canDisableEvc } from '@/utils/evc';
import AppToast from '../Base/AppToast';
import { getLowestPriceOfPlugs, getHighestPowerOfPlugs } from '@/utils/evc';
import { useRouter } from 'next/navigation';
import useCurrencyInfo from '@/hooks/useCurrencyInfo';

interface ManageEvcTableRowProps {
  evc: any;
  isAdmin: boolean;
  user: any;
}

const ManageEvcTableRow: FC<ManageEvcTableRowProps> = ({
  evc,
  isAdmin,
  user,
}) => {
  const router = useRouter();
  let userDetail = user.detail;
  const { currencySymbol } = useCurrencyInfo();

  const [toastMessage, setToastMessage] = useState({
    type: 'info',
    message: '',
  });
  const dispatch = useAppDispatch();
  const [evcStatusModal, setEvcStatusModal] = useState(false);

  const toggleEvcActive = () => {
    if (canDisableEvc({ plugs: evc.plugs }) || !evc.isActive) {
      setEvcStatusModal(true);
    } else {
      setToastMessage({
        type: 'error',
        message: `This EVC has an active booking session and cannot be Disabled`,
      });
    }
  };

  const closeModal = (value: boolean) => {
    setEvcStatusModal(false);
  };

  const changeEvcStatusHandler = async () => {
    setEvcStatusModal(false);
    dispatch(changeEvcStatus(evc.id, !evc.isActive)).then(() => {
      if (isAdmin) {
        dispatch(getEvcByAdmin());
      } else {
        dispatch(getEvcByUser());
      }
    });
  };

  let evcCategories = evc?.plugs?.map((plug: any) => {
    return plug.type;
  });

  let uniqueEvcCategories: string[] = [];

  evcCategories?.forEach((category: string) => {
    if (!uniqueEvcCategories.includes(category)) {
      uniqueEvcCategories.push(category);
    }
  });
  let evcStatus = evc?.isBusy ? 'Busy' : evc.isActive ? 'Active' : 'Disabled';

  const imageSources = evc.plugs.map((plug: any) => {
    let user = { ...userDetail };

    if (userDetail.use.toLowerCase() === 'admin') {
      user = evc.user;
    }

    let imageSrc = '';

    if (user.use?.toLowerCase() === 'commercial') {
      imageSrc = 'commercial.svg';
    }
    if (user.use?.toLowerCase() === 'residential') {
      imageSrc = 'resedential.svg';
    }

    if (plug.isPowandgo) {
      if (plug.power <= 22) {
        imageSrc = 'powandgo.svg';
      }

      if (plug.power > 22) {
        imageSrc = 'powandgo-quickcharge.svg';
      }
    } else {
      if (user.use === 'COMMERCIAL' && plug.power <= 22) {
        imageSrc = 'commercial.svg';
      }

      if (user.use === 'COMMERCIAL' && plug.power > 22) {
        imageSrc = 'commercial-quickcharge.svg';
      }

      if (user.use === 'RESEDENTIAL' && plug.power <= 22) {
        imageSrc = 'resedential.svg';
      }

      if (user.use === 'RESEDENTIAL' && plug.power > 22) {
        imageSrc = 'resedential-quickcharge.svg';
      }
    }
    return imageSrc;
  });

  // Filter out duplicate values to make the array unique

  const uniqueImageSources = Array.from(new Set(imageSources));

  if (evc.user.use?.toLowerCase() === 'admin') return null;

  const editEvcHandler = () => {
    router.push(`/dashboard/evc-management/edit-evc/${evc.id}`);
  };

  const avgRating = () => {
    let ratings = evc.review.map((cur: any) => cur.rating);
    return parseFloat(
      (
        ratings.reduce((a: number, b: number) => a + b) / ratings.length
      ).toFixed(2)
    );
  };

  let evcRating = evc?.review?.length ? avgRating() : 'Not Rated yet';

  return (
    <>
      <tr>
        <td>
          <div className="cell-container">
            <p className="capitalize">{evc.name}</p>
          </div>
        </td>
        <td>
          <div className="cell-container">
            <p>{evcRating}</p>
          </div>
        </td>
        <td className="custom-scrollbar">
          <div className="cell-container max-w-[500px] overflow-x-auto">
            <p>{evc.address}</p>
          </div>
        </td>
        {isAdmin && (
          <td>
            <div className="cell-container">
              <p className="">{evc.user.firstName + ' ' + evc.user.lastName}</p>
            </div>
          </td>
        )}
        {isAdmin && (
          <td>
            <div className="cell-container">
              <p className="">{evc.user.email}</p>
            </div>
          </td>
        )}
        <td>
          <div className="cell-container">
            <p className="">{evc.plugs?.length}</p>
          </div>
        </td>
        {isAdmin && (
          <td>
            <div className="cell-container">
              <p className="">
                {`${getLowestPriceOfPlugs({
                  plugs: evc.plugs,
                })} ${currencySymbol}`}
              </p>
            </div>
          </td>
        )}

        {isAdmin && (
          <td>
            <div className="cell-container">
              <p className="">
                {getHighestPowerOfPlugs({ plugs: evc.plugs })} kWh
              </p>
            </div>
          </td>
        )}

        <td>
          <div className="cell-container !py-[0px] min-w-[140px]">
            <div className="flex flex-row gap-1">
              {uniqueImageSources.map((src, index) => {
                if (!src) return null;

                let imgSrc = `/plugs/${src}`;

                let isQuickChargeImage = String(imgSrc).includes('quickcharge');
                return (
                  <AppImage
                    key={index}
                    src={String(imgSrc)}
                    width={isQuickChargeImage ? 38 : 30}
                    height={isQuickChargeImage ? 38 : 30}
                    alt="Plug"
                    className={`${isQuickChargeImage ? 'mt-[-6px]' : ''}`}
                  />
                );
              })}
            </div>
          </div>
        </td>

        <td>
          <div className="cell-container">
            <p>{evcStatus}</p>
          </div>
        </td>

        <td width={100}>
          <div className="flex w-[100px] flex-row gap-2 items-center">
            {!isAdmin && (
              <div className="cursor-pointer" onClick={editEvcHandler}>
                <AppImage
                  src={'/edit-active.svg'}
                  width={24}
                  height={24}
                  alt="Edit"
                />
              </div>
            )}
            <AppSwitch switchHandler={toggleEvcActive} enabled={evc.isActive} />

            <AppModal isOpen={evcStatusModal} modalHandler={closeModal}>
              <div>
                <p className="text-black text-xl my-4 text-center">
                  Do you want to {evc.isActive ? 'Disable ' : 'Activate '}
                  EVC?
                </p>
                <div className="flex flex-row gap-[10px] items-center justify-center flex-wrap my-2">
                  <AppButton
                    primary
                    onClick={changeEvcStatusHandler}
                    className="min-w-[70px]"
                  >
                    Yes
                  </AppButton>
                  <AppButton secondary onClick={() => closeModal(false)}>
                    Cancel
                  </AppButton>
                </div>
              </div>
            </AppModal>
          </div>
        </td>
      </tr>
      {toastMessage.message && (
        <AppToast
          type={toastMessage.type}
          message={toastMessage.message}
          onClose={() => {
            setToastMessage({
              type: 'info',
              message: '',
            });
          }}
        />
      )}
    </>
  );
};

export default ManageEvcTableRow;
