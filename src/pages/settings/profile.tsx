import Avatar from "@/components/avatar";
import Button from "@/components/button";
import TextField from "@/components/text-field";
import MainLayout from "@/layouts/main";
import { loadUserSuccess, UserPayload } from "@/lib/slice/userSlice";
import { base64ToFile } from "@/utils/baseImage";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Loading from "@/components/loading";
import { useFormik } from "formik";
import { updateProfileSchema } from "@/lib/yup";

const Profile = () => {
  const [loading, setLoading] = React.useState(false);
  const [editProfile, setEditProfile] = React.useState("");
  const dispatch = useDispatch();

  const { user } = useSelector(
    (state: {
      user: {
        user: UserPayload;
      };
    }) => state.user,
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditProfile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateProfile = async (data: any) => {
    setLoading(true);
    try {
      const userUpdate = await fetch(`/api/user/update/${user?.id}`, {
        method: "PATCH",
        headers: {
          referer: `${process.env.NEXTAUTH_URL}`,
          authorization: `Bearer ${user?.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const userData = await userUpdate.json();

      dispatch(
        loadUserSuccess({
          user: userData.data,
        }),
      );
      setLoading(false);
      setEditProfile("");
    } catch (error: any) {
      console.error(error.message || "Something went wrong!");
      setLoading(false);
    }
  };

  const handleUploadPhoto = async () => {
    try {
      const file = base64ToFile(editProfile as string, "profile.jpg");
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          referer: `${process.env.NEXTAUTH_URL}`,
          authorization: `Bearer ${user?.accessToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();

        updateProfile({
          image: data.file.path,
        });
      }
    } catch (error: any) {
      console.error(error.message || "Something went wrong!");
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
    },
    validationSchema: updateProfileSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      updateProfile(values);
      formik.resetForm();
    },
  });

  useEffect(() => {
    if (user) {
      formik.setValues({
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber || "",
        password: "",
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="p-8 rounded-3xl border border-neutral-300">
        {loading && <Loading />}
        <div className="w-full flex flex-col gap-5">
          <label
            htmlFor={"Profile Picture"}
            className={`block text-xl font-normal text-neutral-500`}
          >
            Profile Picture
          </label>
          {editProfile || user?.image ? (
            <Image
              src={editProfile ? editProfile : (user.image as string)}
              alt="Profile Picture"
              width={128}
              height={128}
              className="w-32 h-32 border border-neutral-300 rounded-full"
            />
          ) : (
            <Avatar name="Cargo Compa" className="w-32 h-32" />
          )}

          <div className="flex justify-start items-center gap-4 flex-wrap">
            {!editProfile ? (
              <div className="w-full relative md:w-auto flex cursor-pointer items-center justify-center px-4 py-2.5 rounded-lg font-semibold bg-blue-500 text-white">
                Change Picture
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleChange}
                />
              </div>
            ) : (
              <Button
                type="button"
                style="primary"
                className="w-full md:w-auto"
                ariaLabel={"Delete Picture"}
                onClick={handleUploadPhoto}
              >
                Save Picture
              </Button>
            )}
            <Button
              type="button"
              style="secondary"
              className="w-full md:w-auto"
              ariaLabel={"Delete Picture"}
              onClick={() => {
                editProfile ? setEditProfile("") : updateProfile({ image: "" });
              }}
            >
              Delete Picture
            </Button>
          </div>
        </div>
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col justify-start gap-5 mt-11"
        >
          <TextField
            label="Profile Name"
            ariaLabel="Profile Name"
            placeholder="Enter your profile name"
            labelClassName="text-xl font-normal text-neutral-500"
            value={formik.values.name}
            onChange={(e) => {
              formik.setFieldValue("name", e.target.value);
            }}
            type={"text"}
            error={formik.errors.name}
          />
          <TextField
            label="Email address"
            ariaLabel="Email address"
            placeholder="Enter your email address"
            labelClassName="text-xl font-normal text-neutral-500"
            value={formik.values.email}
            onChange={(e) => {
              formik.setFieldValue("email", e.target.value);
            }}
            type={"email"}
            error={formik.errors.email}
          />
          <TextField
            label="Phone Number"
            ariaLabel="Phone Number"
            placeholder="Enter your phone number"
            labelClassName="text-xl font-normal text-neutral-500"
            value={formik.values.phoneNumber || ""}
            onChange={(e) => {
              formik.setFieldValue("phoneNumber", e.target.value);
            }}
            type={"text"}
            error={formik.errors.phoneNumber}
          />
          <TextField
            label="Password"
            ariaLabel="Password"
            placeholder="Enter your password"
            labelClassName="text-xl font-normal text-neutral-500"
            value={formik.values.password}
            onChange={(e) => {
              formik.setFieldValue("password", e.target.value);
            }}
            type={"password"}
            error={formik.errors.password}
          />
          <div className="flex justify-start items-center gap-4">
            <Button
              type="button"
              onClick={formik.resetForm}
              style="secondary"
              ariaLabel={"Cancel"}
            >
              Cancel
            </Button>
            <Button type="submit" style="primary" ariaLabel={"Save"}>
              Save
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

Profile.getLayout = (page: React.ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};

export default Profile;
