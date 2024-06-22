import LayoutMain from "@/components/layouts/Layout/LayoutMain";
import Button from "@/components/elements/Button/Button";
import Friend from "@/components/elements/Friend/Friend";

export default function FriendList() {
  return (
    <LayoutMain>
      <div className="bg-Neutral-Background-2-Rest h-full w-full flex flex-col text-Neutral-Foreground-1-Rest overflow-y-auto">
        <div className="flex flex-col space-y-4 p-6 shadow-Elevation01-Light dark:shadow-Elevation01-Dark sticky top-0 bg-Neutral-Background-2-Rest">
          <div className="flex flex-row justify-between items-center">
            <div className="text-TitleLarge">Friend List</div>
          </div>

          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row space-x-4">
              <Button fotterVisible={true} label="Type" />
              <Button fotterVisible={true} label="People" />
              <Button fotterVisible={true} label="Modified" />
            </div>
            <div className="flex flex-row space-x-4">
            </div>
          </div>
        </div>

        <div className="space-y-4 p-6">
          <Friend name="Name" info="info01">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Nullam pellentesque lacinia nunc venenatis fringilla.
            Aenean libero odio, ultrices eget ipsum vitae,
            vehicula volutpat nibh. Maecenas consequat,
            nisi faucibus semper mattis, velit elit ultrices felis,
            in tempus dui sapien eget sapien. Suspendisse potenti.
            Vivamus tincidunt, ex at consectetur tempor,
            ligula ex ultricies lorem, sed porta ante.
          </Friend>
        </div>

      </div>
    </LayoutMain>
  );
};
