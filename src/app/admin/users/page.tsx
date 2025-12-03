import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';
import { createUser, deleteUser } from '@/lib/user-actions';
import RoleSelector from '@/components/RoleSelector';

const prisma = new PrismaClient();

export default async function UsersPage() {
    const session = await auth();
    if (session?.user?.role !== 'IT_ADMIN' && session?.user?.role !== 'MANAGER') {
        redirect('/');
    }

    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-10">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">Users</h1>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                        A list of all the users in your account including their name, title, email and role.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    {/* Simple Add User Form Trigger could go here, for now we'll put the form below */}
                </div>
            </div>

            {/* Add User Form */}
            <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-lg font-medium mb-4 dark:text-white">Add New User</h2>
                <form action={async (formData) => {
                    'use server';
                    await createUser(formData);
                }} className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                    <div className="sm:col-span-2">
                        <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">Name</label>
                        <div className="mt-2">
                            <input type="text" name="name" id="name" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3" />
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">Email</label>
                        <div className="mt-2">
                            <input type="email" name="email" id="email" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3" />
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">Password</label>
                        <div className="mt-2">
                            <input type="password" name="password" id="password" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3" />
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="role" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">Role</label>
                        <div className="mt-2">
                            <select id="role" name="role" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 px-3">
                                <option value="FIELD_LEAD_REP">Field Lead Rep</option>
                                <option value="MANAGER">Manager</option>
                                <option value="EXECUTIVE">Executive</option>
                                <option value="IT_ADMIN">IT Admin</option>
                            </select>
                        </div>
                    </div>
                    <div className="sm:col-span-6">
                        <button type="submit" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            Create User
                        </button>
                    </div>
                </form>
            </div>

            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                            <thead>
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-0">Name</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Role</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Email</th>
                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {users.map((user: any) => (
                                    <tr key={user.email}>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-0">{user.name}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                                            <RoleSelector userId={user.id} currentRole={user.role} />
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">{user.email}</td>
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                            <form action={async () => {
                                                'use server';
                                                await deleteUser(user.id);
                                            }} className="inline">
                                                <button type="submit" className="text-red-600 hover:text-red-900">Delete</button>
                                            </form>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
