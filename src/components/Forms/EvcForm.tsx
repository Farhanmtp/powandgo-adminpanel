'use client';

/*
To - do
1- Refactor this to use Better Error Handling Techniques
2- Use Form Library i.e Formik
3- Radio Button Component
4- How to utilize the Formik with Resuable Components
5- REUSABILITY!
6- Try to make this Component Server Side
7- One State for Form
*/

/*

Eid EVC

*/

import React, { FC, ChangeEvent } from 'react';
import AppSelect, { Option } from '../Base/AppSelect';
import { useState, useEffect } from 'react';
import AppButton from '../Base/AppButton';
import AppImage from '../Base/AppImage';
import AppInputField from '../Base/AppInputField';
import AppGoogleMap from '../Base/AppGoogleMap';
import AppModal from '../Base/AppModal';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/redux/hooks';
import { createEVC, updateEVC } from '@/services/evc';
import AppTimeRange from '../Base/AppTimeRange';
import {
  plugTypes,
  parkingCostAfter,
  weekDays,
  shifts,
} from '@/constants/AppConstants';
import AppSwitch from '../Base/AppSwitch';
import AppToast from '../Base/AppToast';
import AppTextArea from '../Base/AppTextArea';
import AppPlugImage from '../Base/AppPlugImage';
import { hours, minutes } from '../Base/AppTimeDropdown';
import { startLoading, stopLoading } from '@/redux/slices/commonSlice';
import useCurrencyInfo from '@/hooks/useCurrencyInfo';

let sectionHeading =
  'text-xl not-italic font-normal leading-[150%] tracking-[-0.2px]';
let sectionContainer = 'flex flex-col gap-[20px]';
let dividerBorder = 'border-t-[#FFFFFF1A]';

interface EvcFormProps {
  editMode?: boolean;
  evcData?: any;
}

const initialPlug = {
  plugName: '',
  plugtype: plugTypes[0],
  plugPrice: '',
  plugPower: '',
  isPowandgo: null,
  serialNo: '',
  plugDisplay: null,
  plugSuggestedPower: 0,
  hardware: '',
};

const EvcForm: FC<EvcFormProps> = ({ editMode = false, evcData = null }) => {
  // States
  const [evcForm, setEvcForm] = useState({
    name: '',
    latitude: 0,
    longitude: 0,
    availableDays: '',
    openingTimes: 'Opening',
    closingTimes: 'Closing',
    cableProvided: null,
    evcImageUrl: '',
    address: '',
    shiftType: '',
    startingAfter: parkingCostAfter[0],
    serialNo: '',
    parking: null,
    parkingFee: '',
    instructions: '',
    plug: '',
    setPower: '',
    setPrice: '',
    connectionDevice: '',
    displayMeasurement: false,
    scheduler: {},
    plugs: [],
  });

  const [shiftType, setShiftType] = useState<Option>(shifts[0]);
  const [weekDay, setWeekDay] = useState<Option[] | Option>([]);
  const [mapModal, setMapModal] = useState(false);
  const [customizeTime, setCustomizeTime] = useState(editMode ? true : false);
  let initialToast = {
    type: '',
    message: '',
  };
  const [toastMsg, setToastMsg] = useState(initialToast);

  const [dailyShifts, setDailyShifts] = useState([
    {
      openingTime: [
        { id: 24, name: '00' },
        { id: 0, name: '00' },
      ],
      closingTime: [
        { id: 24, name: '00' },
        { id: 0, name: '00' },
      ],
    },
    {
      openingTime: [
        { id: 24, name: '00' },
        { id: 0, name: '00' },
      ],
      closingTime: [
        { id: 24, name: '00' },
        { id: 0, name: '00' },
      ],
    },
  ]);
  const [plugs, setPlugs] = useState([initialPlug]);
  const [errors, setErrors] = useState<any>(null);
  const [scheduler, setScheduler] = useState([]);

  const { currencySymbol } = useCurrencyInfo();

  // Initializations
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Handlers

  const evcFormHandler = (key: string, value: any) => {
    setEvcForm((cur) => {
      return {
        ...cur,
        [key]: value,
      };
    });
  };

  const plugHandler = (
    index: number,
    name: string,
    value: string | Option | boolean | number
  ) => {
    setPlugs((currentPlugs) => {
      return currentPlugs.map((plug, currentIndex) => {
        if (currentIndex === index) {
          return { ...plug, [name]: value };
        }
        return plug;
      });
    });
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataURL = e?.target?.result as string;
        setEvcForm((cur) => {
          return {
            ...cur,
            evcImageUrl: imageDataURL,
            image: file,
          };
        });
      };
      reader.readAsDataURL(file);
    } else {
      setEvcForm((cur) => {
        return {
          ...cur,
          evcImageUrl: '',
        };
      });
    }
  };

  const mapModalHandler = (value: boolean) => {
    setMapModal(value);
  };

  const submitEvcHandler = () => {
    let reqFieldsEVC = [
      'name',
      'address',
      'parkingFee',
      'availableDays',
      'latitude',
      'longitude',
    ];

    let reqFieldsPlugs = ['plugPrice', 'plugPower', 'serialNo'];

    let checkIfNullFields = [
      'cableProvided',
      'plugDisplay',
      'isPowandgo',
      'parking',
    ];

    let transPlugs = plugs.map((plug) => {
      return {
        ...plug,
        plugtype: plug.plugtype.name,
        plugName: plug.plugtype.name,
      };
    });

    let transScheduler = scheduler
      .filter((ele: any) => ele.detail.isActive)
      .map((cur: any) => {
        let shifts = cur.detail.shifts;
        return {
          weekDay: cur.name,
          Shifts: [
            {
              openingTime: `${shifts[0]?.openingTime[0]?.name}:${shifts[0]?.openingTime[1]?.name}`,
              closingTime: `${shifts[0]?.closingTime[0]?.name}:${shifts[0]?.closingTime[1]?.name}`,
            },
            {
              openingTime: `${shifts[1]?.openingTime[0]?.name}:${shifts[1]?.openingTime[1]?.name}`,
              closingTime: `${shifts[1]?.closingTime[0]?.name}:${shifts[1]?.closingTime[1]?.name}`,
            },
          ],
        };
      });

    let transAvailableDays =
      Array.isArray(weekDay) && weekDay.map((cur: any) => cur.name);

    let payload: any = {
      ...evcForm,
      latitude: evcForm.latitude,
      longitude: evcForm.longitude,
      startingAfter: evcForm.startingAfter.name,
      plugs: transPlugs,
      availableDays: transAvailableDays.toString(),
      scheduler: JSON.stringify(transScheduler),
      // Temp - Make the image nukl
      evcImageUrl: '',
    };

    let errors: any = {};

    for (let key in payload) {
      if (reqFieldsEVC.includes(key) && !payload[key]) {
        errors[key] = { message: 'Required' };
      }
      if (checkIfNullFields.includes(key) && payload[key] === null) {
        errors[key] = { message: 'Required' };
      }
    }

    payload.plugs.forEach((plug: any) => {
      for (let key in plug) {
        if (reqFieldsPlugs.includes(key) && !plug[key]) {
          if (key == 'serialNo' && plug.isPowandgo) {
            errors[key] = { message: 'Required' };
          } else if (key !== 'serialNo') {
            errors[key] = { message: 'Required' };
          }
        }
        if (checkIfNullFields.includes(key) && plug[key] === null) {
          errors[key] = { message: 'Required' };
        }
      }
    });

    setErrors(errors);

    if (!Object.keys(errors).length) {
      let form = new FormData();

      form.append('name', payload.name);
      form.append('latitude', payload.latitude);
      form.append('longitude', payload.longitude);
      form.append('availableDays', payload.availableDays);
      form.append('openingTimes', payload.openingTime);
      form.append('closingTimes', payload.closingTime);
      form.append('cableProvided', payload.cableProvided);
      form.append('evcImageUrl', payload.evcImageUrl);
      form.append('address', payload.address);
      form.append('shiftType', payload.shiftType || '');
      form.append('startingAfter', payload.startingAfter);
      form.append('serialNo', payload.serialNo);
      form.append('parking', payload.parking);
      form.append('parkingFee', payload.parkingFee);
      form.append('instructions', payload.instructions);
      form.append('plug', '');
      form.append('setPower', '');
      form.append('setPrice', '');
      form.append('connectionDevice', '');
      form.append('displayMeasurement', payload.displayMeasurement);
      form.append('scheduler', payload.scheduler);
      form.append('plugs', payload.plugs);
      form.append('image', payload.image);

      // return;
      dispatch(startLoading());
      dispatch(
        editMode ? updateEVC(payload, Number(evcData.id)) : createEVC(payload)
      )
        .then(() => {
          setToastMsg({
            type: 'successful',
            message: editMode
              ? 'EVC updated Successfully!'
              : 'EVC added Successfully!',
          });
          router.push('/dashboard/evc-management/manage-evc');
        })
        .catch(() => {
          setToastMsg({
            type: 'error',
            message: editMode
              ? 'EVC update unsuccessful!'
              : 'EVC creation unsuccessful!',
          });
        })
        .finally(() => {
          dispatch(stopLoading());
        });
    } else {
      setToastMsg({
        type: 'error',
        message: 'Please fill all the required fields',
      });
    }
  };

  const schedulerHandler = (input: any) => {
    const inputIds = input.map((item: any) => item.id);

    const updatedScheduler = scheduler.map((item: any) => {
      return {
        ...item,
        detail: {
          ...item.detail,
          isActive: inputIds.includes(item.id),
        },
      };
    }) as any;
    setScheduler(updatedScheduler);
    setWeekDay(input);
  };

  const scheduleInputHandler = (
    index: number,
    key: string,
    value: string | boolean
  ) => {
    let updateSchedule = [...scheduler] as any;
    updateSchedule[index].detail[key] = value;
    setScheduler(updateSchedule);
  };

  const scheduleTimeHandler = (
    index: number,
    shiftIndex: number,
    key: string,
    time: any
  ) => {
    let updateSchedule = [...scheduler] as any;
    updateSchedule[index].detail.shifts[shiftIndex][key] = time;
    setScheduler(updateSchedule);
  };

  const updateAllScheduleTime = (
    shiftIndex: number,
    key: string,
    time: any
  ) => {
    let updateSchedule = [...scheduler];
    updateSchedule.forEach((sch: any) => {
      sch.detail.shifts[shiftIndex][key] = time;
    });
    setScheduler(updateSchedule);
  };

  const updateAllShiftType = (value: any) => {
    let updateSchedule = [...scheduler];
    updateSchedule.forEach((sch: any) => {
      sch.detail.shiftType = value.id;
    });
    setScheduler(updateSchedule);
  };

  const removePlugHandler = (index: number) => {
    if (index === 0) return;
    const updatedPlugs = [...plugs];
    updatedPlugs.splice(index, 1);
    setPlugs(updatedPlugs);
  };

  //  Transformers

  function transformScheduler(scheduler: any) {
    return scheduler.map((item: any) => ({
      id: item.id,
      name: item.name,
      detail: {
        isActive: false,
        shiftType: 0,
        shifts: [
          {
            openingTime: [
              { id: 24, name: '00' },
              { id: 0, name: '00' },
            ],
            closingTime: [
              { id: 24, name: '00' },
              { id: 0, name: '00' },
            ],
          },
          {
            openingTime: [
              { id: 24, name: '00' },
              { id: 0, name: '00' },
            ],
            closingTime: [
              { id: 24, name: '00' },
              { id: 0, name: '00' },
            ],
          },
        ],
        ...item.detail,
      },
    }));
  }

  // Use Effects

  function convertData(data: any) {
    const result = data.map((item: any, index: any) => {
      const shiftType =
        item.detail.shifts[1].openingTime[0] === '00' &&
        item.detail.shifts[1].closingTime[0] === '00'
          ? 0
          : 1;
      const shifts = item.detail.shifts.map((shift: any) => {
        const openingTime = [
          hours.find((hour) => hour.name === shift.openingTime[0]),
          minutes.find((minute) => minute.name === shift.openingTime[1]),
        ];
        const closingTime = [
          hours.find((hour) => hour.name === shift.closingTime[0]),
          minutes.find((minute) => minute.name === shift.closingTime[1]),
        ];

        return { openingTime, closingTime };
      });

      return {
        id: index + 1, // You can adjust this as needed
        name: item.name,
        detail: {
          isActive: item.detail.isActive,
          shiftType,
          shifts,
        },
      };
    });

    return result;
  }

  function addDefaultWeekdaysData(originalData: any) {
    const existingDays = originalData.map((item: any) => item.name);
    let data: any = [];

    weekDays.forEach((weekDay, index) => {
      if (existingDays.includes(weekDay.name)) {
        let obj = originalData.find((cur: any) => cur.name === weekDay.name);

        data.push({
          ...obj,
          id: index,
        });
      } else {
        data.push({
          id: index,
          name: weekDay.name,
          detail: {
            isActive: false,
            shiftType: 0,
            shifts: [
              {
                openingTime: [
                  { id: 24, name: '00' },
                  { id: 0, name: '00' },
                ],
                closingTime: [
                  { id: 24, name: '00' },
                  { id: 0, name: '00' },
                ],
              },
              {
                openingTime: [
                  { id: 24, name: '00' },
                  { id: 0, name: '00' },
                ],
                closingTime: [
                  { id: 24, name: '00' },
                  { id: 0, name: '00' },
                ],
              },
            ],
          },
        });
      }
    });
    return data;
  }

  useEffect(() => {
    let initialSchedulerValue = transformScheduler(weekDays);
    setScheduler(initialSchedulerValue);

    if (editMode && evcData) {
      setEvcForm((cur) => {
        return {
          ...cur,
          name: evcData.name,
          latitude: evcData.latitude,
          longitude: evcData.longitude,
          availableDays: evcData.availableDays,
          openingTimes: evcData.openingTimes,
          closingTimes: evcData.closingTimes,
          cableProvided: evcData.cableProvided,
          evcImageUrl: evcData.evcImageUrl,
          parking: evcData.parking,
          parkingFee: evcData.parkingFee,
          instructions: evcData.instructions,
          plug: evcData.plug,
          setPower: evcData.setPower,
          setPrice: evcData.setPrice,
          connectionDevice: evcData.connectionDevice,
          displayMeasurement: evcData.displayMeasurement,
          scheduler: evcData.scheduler,
          address: evcData.address,
          shiftType: evcData.shiftType,
          startingAfter: evcData.startingAfter,
          serialNo: evcData.serialNo,
        };
      });
      setPlugs(() => {
        let plugs = evcData.plugs?.map((plug: any) => {
          return {
            id: plug.id,
            plugName: plug.name,
            plugtype: plugTypes[0],
            plugPrice: plug.price,
            plugPower: plug.power,
            isPowandgo: plug.isPowandgo,
            serialNo: plug.serialNo,
            plugDisplay: plug.displayMeasurement,
            plugSuggestedPower: plug.suggestedPower,
            hardware: plug.hardware,
          };
        });
        return plugs;
      });

      if (evcData.scheduler) {
        let parsedScheduler = JSON.parse(evcData.scheduler);

        const originalData = reverseTransScheduler(parsedScheduler);
        const convertedData = convertData(originalData);
        const dataWithDefaults = addDefaultWeekdaysData(convertedData);

        setWeekDay(
          dataWithDefaults
            .filter((cur: any) => cur?.detail?.isActive)
            .map((cur: any) => {
              return {
                id: cur.id,
                name: cur.name,
              };
            })
        );

        setScheduler(dataWithDefaults);
      }
    }

    return () => {};
  }, []);

  function reverseTransScheduler(transScheduler: any) {
    return transScheduler.map((cur: any) => {
      const shifts = [
        {
          openingTime: cur.Shifts[0].openingTime.split(':'),
          closingTime: cur.Shifts[0].closingTime.split(':'),
        },
        {
          openingTime: cur.Shifts[1].openingTime.split(':'),
          closingTime: cur.Shifts[1].closingTime.split(':'),
        },
      ];

      return {
        name: cur.weekDay,
        detail: {
          isActive: true, // You can set isActive as needed
          shifts,
        },
      };
    });
  }

  let selectedWeekDays = scheduler
    .filter((ele: any) => ele.detail?.isActive)
    .map((cur: any) => {
      return {
        id: cur.id,
        name: cur.name,
      };
    });

  return (
    <div className="flex flex-col gap-[50px] mb-[50px]">
      {/* Spot - Start  */}

      <div className={sectionContainer}>
        <h3 className={sectionHeading}>Set EVC Name and Location</h3>

        <div className="flex flex-col gap-[50px]">
          <div className="flex flex-row gap-[50px] flex-wrap">
            <AppInputField
              value={evcForm.name}
              title="EVC Point Name *"
              inputHandler={(event) => {
                evcFormHandler('name', event.target.value);
              }}
              className="!sm:w-[300px]"
              error={errors?.name?.message}
            />

            <div>
              <div
                onClick={() => mapModalHandler(true)}
                className="flex flex-row gap-1 border-b min-w-[200px] sm:min-w-[300px] items-between justify-between cursor-pointer min-h-[53px]"
              >
                <div>
                  <p className="text-secondary">Address *</p>
                  <p className="min-h-[16px]">{evcForm.address}</p>
                </div>

                <AppImage
                  src={'/pin-location.svg'}
                  alt="Location"
                  width={24}
                  height={24}
                />
              </div>
              {(!evcForm.address ||
                !evcForm.latitude ||
                !evcForm.longitude) && (
                <p className="text-sm text-red-500">
                  {errors?.address?.message ||
                    errors?.latitude?.message ||
                    errors?.longitude?.message}
                </p>
              )}
            </div>

            {mapModal && (
              <AppModal isOpen={mapModal} modalHandler={mapModalHandler}>
                <div className="md:w-[700px] min-h-[300px]">
                  <AppGoogleMap
                    locationChangeHandler={(data) => {
                      setMapModal(false);
                      evcFormHandler('address', data.address);
                      evcFormHandler('latitude', data.lat);
                      evcFormHandler('longitude', data.lng);
                    }}
                    coordinates={{
                      lat: evcForm.latitude || 41.9028,
                      lng: evcForm.longitude || 12.4964,
                    }}
                  />
                </div>
              </AppModal>
            )}
          </div>

          <div className="flex flex-row flex-wrap gap-[50px]">
            <div className="flex flex-col gap-2 items-start">
              <p className="form-label">Cable Provided *</p>
              <div className=" flex flex-row gap-6">
                <div className="flex flex-row gap-1">
                  <input
                    type="radio"
                    id="yes"
                    name="cableProvided"
                    value="true"
                    checked={evcForm.cableProvided === true}
                    onChange={(e) => {
                      evcFormHandler('cableProvided', true);
                    }}
                  />
                  <label htmlFor="yes">Yes</label>
                </div>

                <div className="flex flex-row gap-1">
                  <input
                    type="radio"
                    id="no"
                    name="cableProvided"
                    value="false"
                    checked={evcForm.cableProvided === false}
                    onChange={(e) => {
                      evcFormHandler('cableProvided', false);
                    }}
                  />
                  <label htmlFor="no">No</label>
                </div>
              </div>
              {errors?.cableProvided && evcForm.cableProvided === null && (
                <p className="text-sm text-red-500">
                  {errors.cableProvided.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-secondary">Capture / Uploads</p>
              <input
                type="file"
                id="uploadEvcImage"
                accept="image/*"
                onChange={handleImageChange}
                capture="environment"
                className=""
              />
            </div>

            {evcForm.evcImageUrl && (
              <div>
                <p className="text-secondary">Selected Image:</p>
                <AppImage
                  src={evcForm.evcImageUrl}
                  alt="Selected"
                  width={50}
                  height={50}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Spot - End */}

      <hr className={dividerBorder} />

      {/* Scheduler - Start */}

      <div className={sectionContainer}>
        <h3 className={sectionHeading}>Scheduler</h3>

        <div className="flex flex-row gap-[50px] flex-wrap justify-start items-start">
          <AppSelect
            options={weekDays}
            selected={selectedWeekDays}
            selectHandler={schedulerHandler}
            multiple={true}
            title="Days *"
            className="w-[270px] sm:w-[310px]"
            placeholder="Please select the number of days"
            error={
              !selectedWeekDays.length ? errors?.availableDays?.message : ''
            }
          />
          <AppSelect
            options={shifts}
            selected={shiftType}
            selectHandler={(value) => {
              setShiftType(value as Option);
              updateAllShiftType(value);
            }}
            multiple={false}
            title="Shifts *"
            className="w-[200px] sm:w-[310px]"
            disable={customizeTime}
          />
        </div>

        <div className="flex flex-row gap-[50px] flex-wrap justify-start items-end">
          <AppTimeRange
            time={dailyShifts[0]}
            openTimeHandler={(value: any) => {
              updateAllScheduleTime(0, 'openingTime', value);
            }}
            closeTimeHandler={(value: any) => {
              updateAllScheduleTime(0, 'closingTime', value);
            }}
            disable={customizeTime}
          />
          {shiftType?.id === 1 && (
            <>
              <AppTimeRange
                time={dailyShifts[1]}
                openTimeHandler={(value: any) => {
                  updateAllScheduleTime(1, 'openingTime', value);
                }}
                closeTimeHandler={(value: any) => {
                  updateAllScheduleTime(1, 'closingTime', value);
                }}
                disable={customizeTime}
              />
            </>
          )}

          <AppButton
            onClick={() => {
              setCustomizeTime((cur) => !cur);
            }}
            secondary
            className="h-[45px] py-[4px] px-[24px]"
          >
            <div className="flex flex-row gap-[10px] items-center">
              <AppImage
                src="/plus-circle.svg"
                alt="Add Icon"
                width={19}
                height={19}
              />
              <p>Customize Scheduler</p>
            </div>
          </AppButton>
        </div>
      </div>

      {/* Scheduler - End */}

      {/* Customize - Start  */}

      {customizeTime && (
        <>
          <hr className={dividerBorder} />
          <div className="flex flex-col gap-[50px] flex-wrap justify-start overflow-x-auto">
            {scheduler.map((ele: any, index) => {
              return (
                <div
                  key={index}
                  className="flex flex-row gap-[40px] items-center"
                >
                  <AppSwitch
                    switchHandler={(value) => {
                      scheduleInputHandler(index, 'isActive', value);
                    }}
                    enabled={ele?.detail?.isActive}
                  />

                  <p className="min-w-[90px] text-lg">{ele.name}</p>

                  <AppSelect
                    options={shifts}
                    selected={shifts[ele.detail.shiftType]}
                    selectHandler={(value: any) => {
                      scheduleInputHandler(index, 'shiftType', value.id);
                    }}
                    multiple={false}
                    title="Shift *"
                    className="w-[200px] sm:w-[200px]"
                    disable={!ele?.detail?.isActive}
                  />

                  <AppTimeRange
                    openTimeHandler={(value: any) => {
                      scheduleTimeHandler(index, 0, 'openingTime', value);
                    }}
                    closeTimeHandler={(value: any) => {
                      scheduleTimeHandler(index, 0, 'closingTime', value);
                    }}
                    time={ele.detail.shifts[0]}
                    disable={!ele?.detail?.isActive}
                  />

                  {ele.detail.shiftType === 1 && (
                    <>
                      <hr className="w-[40px] border-t-secondary" />
                      <AppTimeRange
                        openTimeHandler={(value: any) => {
                          scheduleTimeHandler(index, 1, 'openingTime', value);
                        }}
                        closeTimeHandler={(value: any) => {
                          scheduleTimeHandler(index, 1, 'closingTime', value);
                        }}
                        time={ele.detail.shifts[1]}
                        disable={!ele?.detail?.isActive}
                      />
                    </>
                  )}
                </div>
              );
            })}
            {scheduler.length === 0 && <p>Please select days</p>}
          </div>
        </>
      )}

      {/* Customize - End  */}
      <hr className={dividerBorder} />

      {/* Parking - Start */}
      <div className={sectionContainer}>
        <h3 className={sectionHeading}>Parking Cost</h3>

        <div className="flex flex-row gap-[50px] flex-wrap">
          <AppInputField
            value={evcForm.parkingFee}
            title="Parking Cost *"
            inputHandler={(event) => {
              evcFormHandler('parkingFee', parseInt(event.target.value));
            }}
            className="!w-[180px]"
            type="number"
            error={errors?.parkingFee?.message}
            endingText={`${currencySymbol}/min`}
          />

          <AppSelect
            options={parkingCostAfter}
            selected={evcForm.startingAfter}
            selectHandler={(value) => {
              evcFormHandler('startingAfter', value);
            }}
            multiple={false}
            title="Charge Parking After *"
            className="!w-[180px]"
          />
        </div>
      </div>
      {/* Parking - End */}

      <hr className={dividerBorder} />

      {/* Comments - Start */}

      <div className={sectionContainer}>
        <h3 className={sectionHeading}>
          Leave some contact instructions for who will book your EVC:
        </h3>
        <AppTextArea
          title="Comments"
          textAreaProps={{ maxLength: '600', rows: '2' }}
          value={evcForm.instructions}
          handleChange={(value) => {
            evcFormHandler('instructions', value);
          }}
          placeholder="Max 600 characters..."
          className="max-w-[700px]"
        />
      </div>

      {/* Comments - End */}

      <hr className={dividerBorder} />

      {/* Plugs - Start */}
      <div className={sectionContainer}>
        <div className="flex flex-row gap-2 justify-between items-center w-full">
          <h3 className={sectionHeading}>Add Plug</h3>
          <AppButton
            onClick={() => {
              setPlugs((cur) => {
                return [...cur, initialPlug];
              });
            }}
            secondary
            className="h-[45px] py-[4px] px-[24px]"
          >
            <p className="text-sm md:text-normal">Add More Plugs</p>
          </AppButton>
        </div>
        {plugs?.map((plug, index) => {
          return (
            <div key={index} className="flex flex-col gap-[50px]">
              {index !== 0 && <hr className="border-t-[#FFFFFF0D]" />}
              <div
                key={index}
                className="flex flex-row gap-[35px] flex-wrap justify-start items-center"
              >
                <div className="flex flex-row gap-3 items-center">
                  <AppPlugImage
                    name={plug.plugtype.name}
                    plugImg={plug.plugtype.img}
                  />
                  <AppSelect
                    options={plugTypes}
                    selected={plug.plugtype}
                    selectHandler={(value) => {
                      plugHandler(index, 'plugtype', value as Option);
                    }}
                    multiple={false}
                    title="Plug *"
                    className="w-[170px]"
                  />
                </div>

                <AppInputField
                  value={plug.plugPrice}
                  title="Plug Price *"
                  inputHandler={(event) => {
                    plugHandler(index, 'plugPrice', Number(event.target.value));
                  }}
                  type="number"
                  error={errors?.plugPrice?.message}
                  endingText={`${currencySymbol}/kWh`}
                  className="!w-[140px]"
                />
                <AppInputField
                  value={plug.plugPower}
                  title="Plug Power *"
                  inputHandler={(event) => {
                    const inputValue = event.target.value;
                    const newValue =
                      inputValue === '' ? '' : Number(inputValue);
                    plugHandler(index, 'plugPower', newValue);
                  }}
                  type="number"
                  error={errors?.plugPower?.message}
                  endingText="kWh"
                  className="!w-[140px]"
                />
                <div className="flex flex-col gap-2 items-start">
                  <p className="form-label">Meter Display *</p>
                  <div className=" flex flex-row gap-6">
                    <div className="flex flex-row gap-1">
                      <input
                        type="radio"
                        id="yes"
                        name={`meterDisplay${index}`}
                        value="true"
                        checked={plug.plugDisplay === true}
                        onChange={(e) => {
                          plugHandler(index, 'plugDisplay', true);
                        }}
                      />
                      <label htmlFor="yes">Yes</label>
                    </div>

                    <div className="flex flex-row gap-1">
                      <input
                        type="radio"
                        id="no"
                        name={`meterDisplay${index}`}
                        value="false"
                        checked={plug.plugDisplay === false}
                        onChange={(e) => {
                          plugHandler(index, 'plugDisplay', false);
                        }}
                      />
                      <label htmlFor="no">No</label>
                    </div>
                  </div>
                  {errors?.plugDisplay && plug.plugDisplay === null && (
                    <p className="text-sm text-red-500">
                      {errors.plugDisplay.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2 items-start">
                  <p className="form-label">Extra Parking Space *</p>
                  <div className=" flex flex-row gap-6">
                    <div className="flex flex-row gap-1">
                      <input
                        type="radio"
                        id="yes"
                        name={`parking${index}`}
                        value="true"
                        // checked={evcForm.parking === true}
                        onChange={(e) => {
                          evcFormHandler('parking', true);
                        }}
                      />
                      <label htmlFor="yes">Yes</label>
                    </div>

                    <div className="flex flex-row gap-1">
                      <input
                        type="radio"
                        id="no"
                        name={`parking${index}`}
                        value="false"
                        // checked={evcForm.parking === false}
                        onChange={(e) => {
                          evcFormHandler('parking', false);
                        }}
                      />
                      <label htmlFor="no">No</label>
                    </div>
                  </div>
                  {errors?.parking && evcForm.parking === null && (
                    <p className="text-sm text-red-500">
                      {errors.parking.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2 items-start">
                  <p className="form-label">powandgo EVC *</p>
                  <div className=" flex flex-row gap-6">
                    <div className="flex flex-row gap-1">
                      <input
                        type="radio"
                        id="yes"
                        name={`powandgohardware${index}`}
                        value="true"
                        checked={plug.isPowandgo === true}
                        onChange={(e) => {
                          plugHandler(index, 'isPowandgo', true);
                        }}
                      />
                      <label htmlFor="yes">Yes</label>
                    </div>

                    <div className="flex flex-row gap-1">
                      <input
                        type="radio"
                        id="no"
                        name={`powandgohardware${index}`}
                        value="false"
                        checked={plug.isPowandgo === false}
                        onChange={(e) => {
                          plugHandler(index, 'isPowandgo', false);
                        }}
                      />
                      <label htmlFor="no">No</label>
                    </div>
                  </div>
                  {errors?.isPowandgo && plug.isPowandgo === null && (
                    <p className="text-sm text-red-500">
                      {errors.isPowandgo.message}
                    </p>
                  )}
                </div>
                {plug.isPowandgo && (
                  <AppInputField
                    value={plug.serialNo}
                    title="Serial Number *"
                    inputHandler={(event) => {
                      plugHandler(index, 'serialNo', event.target.value);
                    }}
                    error={errors?.serialNo?.message}
                    className="!w-[150px]"
                  />
                )}
                {index !== 0 && (
                  <div
                    onClick={() => removePlugHandler(index)}
                    className=" !h-[56px] flex items-center justify-center cursor-pointer"
                  >
                    <AppImage
                      src={'/delete.png'}
                      alt="Delete Plug"
                      width={26}
                      height={26}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* Plugs - End */}

      {/* Submit Start */}

      <div className="flex flex-row gap-3">
        <AppButton
          onClick={() => {
            router.push('/dashboard/evc-management/manage-evc');
          }}
          secondary
          className="h-[45px] py-[4px] px-[24px]"
        >
          <div className="flex flex-row gap-[10px] items-center">
            <p>Cancel</p>
          </div>
        </AppButton>
        <AppButton
          onClick={submitEvcHandler}
          primary
          className="h-[45px] py-[4px] px-[24px]"
        >
          <div className="flex flex-row gap-[10px] items-center">
            <p>{editMode ? 'Update EVC' : 'Add EVC'}</p>
          </div>
        </AppButton>
      </div>

      {/* Submit End */}

      {toastMsg.message && (
        <AppToast
          message={toastMsg.message}
          type={toastMsg.type}
          onClose={() => {
            setToastMsg(initialToast);
          }}
        />
      )}
    </div>
  );
};

export default EvcForm;
