import React, { FC, useState } from 'react';
import AppModal from '../Base/AppModal';
import AppSwitch from '../Base/AppSwitch';
import AppButton from '../Base/AppButton';
import { getHumanReadableDate } from '@/utils/dateTime';
import AppImage from '../Base/AppImage';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/redux/hooks';
import { startLoading, stopLoading } from '@/redux/slices/commonSlice';
import { updateUserStatus } from '@/services/user';
import { showNotification } from '@/redux/slices/commonSlice';

interface UserTableRowProps {
  user: any;
}

const UserTableRow: FC<UserTableRowProps> = ({ user }) => {
  const dispatch = useAppDispatch();

  const router = useRouter();
  const [userStatusModal, setUserStatusModal] = useState(false);

  const [userActive, setUserActive] = useState(user.isActive);

  const toggleUserActive = (value: boolean) => {
    setUserStatusModal(true);
  };

  const closeModal = (value: boolean) => {
    setUserStatusModal(false);
  };

  const changeUserStatus = () => {
    let userStatus = userActive;
    setUserActive((cur: boolean) => !cur);

    dispatch(startLoading());
    dispatch(
      updateUserStatus(user.id, {
        isActive: !userStatus,
      })
    )
      .then(() => {
        dispatch(
          showNotification({
            type: 'successful',
            message: `User Updated Successfully`,
          })
        );
      })
      .catch((error) => {
        dispatch(
          showNotification({
            type: 'error',
            message: error.response.data.message || 'User update unsuccessful',
          })
        );
        setUserActive(userStatus);
      })
      .finally(() => {
        dispatch(stopLoading());
      });

    setUserStatusModal(false);
  };

  const editUser = () => {
    router.push(`/dashboard/user-management/edit-user/${user.id}`);
  };

  return (
    <tr>
      <td>
        <div className="cell-container">
          <p>{user.firstName}</p>
        </div>
      </td>
      <td>
        <div className="cell-container">
          <p>{user.lastName}</p>
        </div>
      </td>
      <td>
        <div className="cell-container">
          <p>{user.email}</p>
        </div>
      </td>
      <td>
        <div className="cell-container">
          <p>
            {user.use
              ? user.use.charAt(0) + user.use.slice(1).toLowerCase()
              : ''}
          </p>
        </div>
      </td>
      <td>
        <div className="cell-container">
          <p>{user.createdAt ? getHumanReadableDate(user.createdAt) : ''}</p>
        </div>
      </td>
      <td>
        <div className="cell-container !border-b-primary flex items-center gap-3">
          <>
            <AppSwitch switchHandler={toggleUserActive} enabled={userActive} />
            <AppModal isOpen={userStatusModal} modalHandler={closeModal}>
              <div>
                <p className="text-black text-xl my-4 text-center">
                  Do you want to {userActive ? 'deactivate ' : 'activate '}
                  User?
                </p>
                <div className="flex flex-row gap-[10px] items-center justify-center flex-wrap my-2">
                  <AppButton
                    primary
                    onClick={changeUserStatus}
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
          </>
          <>
            <div className="cursor-pointer" onClick={editUser}>
              <AppImage
                src={'/edit-active.svg'}
                width={24}
                height={24}
                alt="Edit"
              />
            </div>
          </>
        </div>
      </td>
    </tr>
  );
};

export default UserTableRow;
