import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Link from 'next/link';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import useCurrentUser from '@/hooks/useCurrentUser';

export default function AccountMenux() {
  const { data: currentUser, error } = useCurrentUser();

  return (
    <div className="relative w-[40px] h-[40px]">
      <Menu as="div">
        <div>
          <Menu.Button className="inline-flex w-full justify-center rounded-full bg-black bg-opacity-20 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            <Image
              width={40}
              height={40}
              className="rounded-full"
              src={
                currentUser?.image
                  ? currentUser.image
                  : '/images/default-slate.png'
              }
              alt={`${currentUser?.name}`}
              priority
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt- w-56 origin-top-right rounded-md bg-zinc-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="/profiles"
                    className={`${
                      active ? 'bg-[#1c1c1c] text-white' : ''
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm gap-2`}
                  >
                    <Image
                      width={32}
                      height={32}
                      className="w-8 rounded-full"
                      src={
                        currentUser?.image
                          ? currentUser.image
                          : '/images/default-slate.png'
                      }
                      alt=""
                    />
                    <p className="text-white text-sm group-hover/item:underline">
                      {currentUser?.name}
                    </p>
                  </Link>
                )}
              </Menu.Item>
            </div>
            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="#"
                    onClick={() => signOut()}
                    className={`${
                      active ? 'bg-[#1c1c1c] ' : ''
                    }text-white group flex w-full items-center rounded-md px-2 py-2 text-sm gap-2`}
                  >
                    <span className="w-8 h-8 flex justify-center">
                      <ArrowRightOnRectangleIcon className="w-6" />
                    </span>
                    Logout
                  </Link>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
