import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Routes from 'config/routes.json';

export default function Sidebar() {
  const [collapseShow, setCollapseShow] = React.useState('hidden');
  const router = useRouter();

  return (
    <>
      <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
          {/* Toggler */}
          <button
            className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
            type="button"
            onClick={() => setCollapseShow('bg-white m-2 py-3 px-6')}
          >
            <i className="fas fa-bars"></i>
          </button>
          {/* Brand */}
          <Link
            href={Routes.manage.name}
            className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
          >
            University of Science
          </Link>

          {/* Collapse */}
          <div
            className={
              'md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded ' +
              collapseShow
            }
          >
            {/* Divider */}
            <hr className="my-4 md:min-w-full" />
            {/* Heading */}
            <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
              Quản lý thành viên
            </h6>
            {/* Navigation */}

            <ul className="md:flex-col md:min-w-full flex flex-col list-none">
              <li className="items-center">
                <Link
                  href={Routes.manageRegistration.name}
                  className={
                    'text-xs uppercase py-3 font-bold block ' +
                    (router.pathname.indexOf(
                      Routes.manageRegistration.name
                    ) !== -1
                      ? 'text-lightBlue-500 hover:text-lightBlue-600'
                      : 'text-blueGray-700 hover:text-blueGray-500')
                  }
                >
                  <i
                    className={
                      'fas fa-file-invoice mr-2 text-sm ' +
                      (router.pathname.indexOf(
                        Routes.manageRegistration.name
                      ) !== -1
                        ? 'opacity-75'
                        : 'text-blueGray-300')
                    }
                  ></i>{' '}
                  Đơn đăng ký
                </Link>
              </li>

              <li className="items-center">
                <Link
                  href={Routes.member.name}
                  className={
                    'text-xs uppercase py-3 font-bold block ' +
                    (router.pathname.indexOf(Routes.member.name) !== -1
                      ? 'text-lightBlue-500 hover:text-lightBlue-600'
                      : 'text-blueGray-700 hover:text-blueGray-500')
                  }
                >
                  <i
                    className={
                      'fas fa-user mr-2 text-sm ' +
                      (router.pathname.indexOf(Routes.member.name) !==
                      -1
                        ? 'opacity-75'
                        : 'text-blueGray-300')
                    }
                  ></i>{' '}
                  Danh sách thành viên
                </Link>
              </li>
            </ul>

            {/* Divider */}
            <hr className="my-4 md:min-w-full" />
            {/* Heading */}
            <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
              Quản lý môn học
            </h6>
            {/* Navigation */}

            <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
              <li className="items-center">
                <Link
                  href={Routes.createCourse.name}
                  className={
                    'text-xs uppercase py-3 font-bold block ' +
                    (router.pathname.indexOf(
                      Routes.createCourse.name
                    ) !== -1
                      ? 'text-lightBlue-500 hover:text-lightBlue-600'
                      : 'text-blueGray-700 hover:text-blueGray-500')
                  }
                >
                  <i
                    className={
                      'fas fa-circle-plus text-blueGray-400 mr-2 text-sm' +
                      (router.pathname.indexOf(
                        Routes.createCourse.name
                      ) !== -1
                        ? 'opacity-75'
                        : 'text-blueGray-300')
                    }
                  ></i>{' '}
                  Tạo môn học
                </Link>
              </li>

              <li className="items-center">
                <Link
                  href={Routes.courses.name}
                  className={
                    'text-xs uppercase py-3 font-bold block ' +
                    (router.pathname.indexOf(Routes.courses.name) !==
                    -1
                      ? 'text-lightBlue-500 hover:text-lightBlue-600'
                      : 'text-blueGray-700 hover:text-blueGray-500')
                  }
                >
                  <i
                    className={
                      'fas fa-list text-blueGray-300 mr-2 text-sm' +
                      (router.pathname.indexOf(
                        Routes.courses.name
                      ) !== -1
                        ? 'opacity-75'
                        : 'text-blueGray-300')
                    }
                  ></i>{' '}
                  Danh sách môn học
                </Link>
              </li>
            </ul>

            {/* Divider */}
            <hr className="my-4 md:min-w-full" />
            {/* Heading */}
            <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
              Quản lý lớp học
            </h6>
            {/* Navigation */}

            <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
              <li className="items-center">
                <Link
                  href={Routes.createClass.name}
                  className={
                    'text-xs uppercase py-3 font-bold block ' +
                    (router.pathname.indexOf(
                      Routes.createClass.name
                    ) !== -1
                      ? 'text-lightBlue-500 hover:text-lightBlue-600'
                      : 'text-blueGray-700 hover:text-blueGray-500')
                  }
                >
                  <i
                    className={
                      'fas fa-circle-plus text-blueGray-400 mr-2 text-sm' +
                      (router.pathname.indexOf(
                        Routes.createClass.name
                      ) !== -1
                        ? 'opacity-75'
                        : 'text-blueGray-300')
                    }
                  ></i>{' '}
                  Tạo lớp học
                </Link>
              </li>

              <li className="items-center">
                <Link
                  href={Routes.classes.name}
                  className={
                    'text-xs uppercase py-3 font-bold block ' +
                    (router.pathname.indexOf(Routes.classes.name) !==
                    -1
                      ? 'text-lightBlue-500 hover:text-lightBlue-600'
                      : 'text-blueGray-700 hover:text-blueGray-500')
                  }
                >
                  <i
                    className={
                      'fas fa-list text-blueGray-400 mr-2 text-sm' +
                      (router.pathname.indexOf(
                        Routes.classes.name
                      ) !== -1
                        ? 'opacity-75'
                        : 'text-blueGray-300')
                    }
                  ></i>{' '}
                  Danh sách lớp học
                </Link>
              </li>

              <li className="items-center">
                <Link
                  href={Routes.registerTime.name}
                  className={
                    'text-xs uppercase py-3 font-bold block ' +
                    (router.pathname.indexOf(
                      Routes.registerTime.name
                    ) !== -1
                      ? 'text-lightBlue-500 hover:text-lightBlue-600'
                      : 'text-blueGray-700 hover:text-blueGray-500')
                  }
                >
                  <i
                    className={
                      'fas fa-hourglass text-blueGray-400 mr-2 text-sm' +
                      (router.pathname.indexOf(
                        Routes.registerTime.name
                      ) !== -1
                        ? 'opacity-75'
                        : 'text-blueGray-300')
                    }
                  ></i>{' '}
                  Chỉnh sửa thời gian đăng ký học phần
                </Link>
              </li>
            </ul>

            {/* Divider */}
            <hr className="my-4 md:min-w-full" />
            {/* Heading */}
            <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
              Quản lý tốt nghiệp
            </h6>
            {/* Navigation */}
            <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
              <li className="items-center">
                <Link
                  href={Routes.requestGraduationList.name}
                  className={
                    'text-xs uppercase py-3 font-bold block ' +
                    (router.pathname.indexOf(Routes.courses.name) !==
                    -1
                      ? 'text-lightBlue-500 hover:text-lightBlue-600'
                      : 'text-blueGray-700 hover:text-blueGray-500')
                  }
                >
                  <i
                    className={
                      'fas fa-file-invoice text-blueGray-400 mr-2 text-sm' +
                      (router.pathname.indexOf(
                        Routes.courses.name
                      ) !== -1
                        ? 'opacity-75'
                        : 'text-blueGray-300')
                    }
                  ></i>{' '}
                  Sinh viên yêu cầu tốt nghiệp
                </Link>
              </li>

              <li className="items-center">
                <Link
                  href={Routes.graduationList.name}
                  className={
                    'text-xs uppercase py-3 font-bold block ' +
                    (router.pathname.indexOf(Routes.courses.name) !==
                    -1
                      ? 'text-lightBlue-500 hover:text-lightBlue-600'
                      : 'text-blueGray-700 hover:text-blueGray-500')
                  }
                >
                  <i
                    className={
                      'fas fa-graduation-cap text-blueGray-400 mr-2 text-sm' +
                      (router.pathname.indexOf(
                        Routes.courses.name
                      ) !== -1
                        ? 'opacity-75'
                        : 'text-blueGray-300')
                    }
                  ></i>{' '}
                  Sinh viên đã tốt nghiệp
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
