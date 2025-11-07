"use client";

import { useUser } from "@/services/usersService";
import { useParams, useRouter } from "next/navigation";
import { Spinner, Button, Card, CardBody, CardHeader, Avatar, Chip } from "@heroui/react";
import { ArrowLeft, Mail, User, Calendar, Clock, Shield } from "lucide-react";

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data, isLoading, isError, error } = useUser(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Error</h2>
          <p className="text-gray-600 mt-2">
            {error instanceof Error ? error.message : "Failed to load user"}
          </p>
          <Button
            className="mt-4"
            onPress={() => router.push("/users")}
          >
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

  const user = data.data;

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Button
          variant="light"
          startContent={<ArrowLeft className="h-4 w-4" />}
          onPress={() => router.push("/users")}
        >
          Back to Users
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardBody className="items-center text-center p-6">
            <Avatar
              src={user.imageUrl}
              name={user.fullName || user.email || "User"}
              className="w-24 h-24 mb-4"
            />
            <h2 className="text-2xl font-bold">{user.fullName || "N/A"}</h2>
            {user.username && (
              <p className="text-gray-600 text-sm">@{user.username}</p>
            )}
            <div className="mt-4 flex items-center gap-2">
              {user.emailVerified ? (
                <Chip color="success" variant="flat" startContent={<Shield className="w-3 h-3" />}>
                  Verified
                </Chip>
              ) : (
                <Chip color="warning" variant="flat">
                  Unverified
                </Chip>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Details Card */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <User className="h-6 w-6 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold">User Details</h1>
              <p className="text-sm text-gray-600">Information from Clerk</p>
            </div>
          </CardHeader>
          <CardBody className="space-y-6 p-6">
            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">User ID</label>
                  <p className="text-gray-900 mt-1 font-mono text-xs break-all">{user.id}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    Email
                  </label>
                  <p className="text-gray-900 mt-1">{user.email || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">First Name</label>
                  <p className="text-gray-900 mt-1">{user.firstName || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Last Name</label>
                  <p className="text-gray-900 mt-1">{user.lastName || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Activity
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Created At</label>
                  <p className="text-gray-900 mt-1">
                    {new Date(user.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Updated At</label>
                  <p className="text-gray-900 mt-1">
                    {new Date(user.updatedAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Last Sign In
                  </label>
                  <p className="text-gray-900 mt-1">
                    {user.lastSignInAt
                      ? new Date(user.lastSignInAt).toLocaleString()
                      : "Never"}
                  </p>
                </div>
              </div>
            </div>

            {/* Phone Numbers */}
            {user.phoneNumbers && user.phoneNumbers.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">Phone Numbers</h3>
                <div className="space-y-2">
                  {user.phoneNumbers.map((phone, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-gray-900">{phone.phoneNumber}</span>
                      {phone.verified && (
                        <Chip size="sm" color="success" variant="flat">
                          Verified
                        </Chip>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* External Accounts */}
            {user.externalAccounts && user.externalAccounts.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">External Accounts</h3>
                <div className="space-y-2">
                  {user.externalAccounts.map((account, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Chip color="primary" variant="flat">
                        {account.provider}
                      </Chip>
                      <span className="text-gray-900 text-sm">
                        {account.emailAddress}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
