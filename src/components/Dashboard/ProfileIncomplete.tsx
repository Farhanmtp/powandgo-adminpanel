import React from 'react';
import AppPlaceholder from '../Base/AppPlaceholder';

interface MissingAccountInfoType {
  displayName: string;
  name: string;
}

interface ProfileIncompleteProps {
  missingAccountInfo: MissingAccountInfoType[] | undefined;
  missingList?: string[];
}

const ProfileIncomplete: React.FC<ProfileIncompleteProps> = ({
  missingAccountInfo,
  missingList,
}) => {
  return (
    <div>
      <AppPlaceholder>
        <p className="text-secondary">
          Please complete your profile in order to use this feature. We need the
          following information in Account Settings:
        </p>
        <ul className="list-disc mx-5">
          {missingList?.map((cur: string, i: number) => {
            return <li key={i}>{cur}</li>;
          })}
        </ul>
      </AppPlaceholder>
    </div>
  );
};

export default ProfileIncomplete;
