"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import ChatPresence from "./ChatPresence";
import { fetchApi, getFinalLocationAndCookies } from "@/lib/apiClient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Data,
  DataWaittingScan,
  getQrcode,
  getWaittingScan,
  getWaittingScanConfirm,
  getZaloSession,
  getZpid,
  QrResponse,
  veryfifyClient,
} from "@/src/service/LoginService";
import { generateAndStoreCode } from "@/lib/utils";
import { Data } from "src\service\LoginService";

export default function ChatHeader({ user }: { user: User | undefined }) {
  const router = useRouter();
  const [qrCodeData, setQrCodeData] = useState<Data | {}>({});
  const [openLogin, setOpenLogin] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<DataWaittingScan | {}>({});
  useEffect(() => {
    const zpdid: string | null = localStorage.getItem("zpdid");
    if (!zpdid || zpdid == null) {
      getZpid();
    }
  }, []);

  const localStorageToCookies = () => {
    Object.keys(localStorage).forEach((key) => {
      const value = localStorage.getItem(key);
      document.cookie = `${key}=${value};`;
    });
  };

  const handleLoginWithGithub = async () => {
    getZaloSession();
    veryfifyClient();
    const qrResponse = await getQrcode();
    if (qrResponse) {
      setQrCodeData(qrResponse.data);
      setOpenLogin(true);
      const code: string = qrResponse.data.code;
      const userProfilerResponse = await getWaittingScan(code);
      if(userProfilerResponse){
        if (userProfilerResponse && userProfilerResponse.data.display_name) {
          if (userProfilerResponse.data.display_name) {
            const userProfilerResponse1 = await getWaittingScanConfirm(code);
            setOpenLogin(false);
            setUserProfile(userProfilerResponse.data);
            console.log("Login successful");
            localStorageToCookies();
            getFinalLocationAndCookies();
          } else {
            console.log("Waiting scan did not succeed:", qrResponse);
          }
        }else if (userProfilerResponse && userProfilerResponse.data.code) {
           let dataQr :Data = {
            image: userProfilerResponse.data.image,
            code: userProfilerResponse.data.code,
            token: userProfilerResponse.data.token,
            options: userProfilerResponse.data.options
          } 
          setQrCodeData(dataQr);
          const code: string = userProfilerResponse.data.code;
          const userProfilerResponse2 = await getWaittingScan(code);
          if (userProfilerResponse2 && userProfilerResponse2.data.display_name) {
            const userProfilerResponse1 = await getWaittingScanConfirm(code);
            setOpenLogin(false);
            setUserProfile(userProfilerResponse2.data);
            console.log("Login successful");
            localStorageToCookies();
            getFinalLocationAndCookies();
          } else {
            console.log("Waiting scan did not succeed:", qrResponse);
          }
        }
      }
    }
  };

  const loginSuccess= async () => {
    router.refresh();
  };

  const handleLogout = async () => {
    router.refresh();
  };

  const handleClose = () => {
    console.log("Dialog has been closed");
    setOpenLogin(false);
    setQrCodeData({});
  };

  const renderDialogDemo = () => {
    // const { image } = qrCodeData;
    let image: string | undefined;
    if ("image" in qrCodeData) {
      image = qrCodeData.image;
    }
    return (
      <Dialog
        defaultOpen
        onOpenChange={(open) => (open ? setOpenLogin(true) : handleClose())}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Quét đuê người ae</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {qrCodeData && (
              <div className="flex justify-center">
                <img src={image} alt="QR Code" className="w-50 h-50" />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const renderAvatar = () => {
    let avatar: string | undefined;
    if ("avatar" in userProfile) {
      avatar = userProfile.avatar;
    }
    let display_name: string | undefined;
    if ("display_name" in userProfile) {
      display_name = userProfile.display_name;
    }
    // const { avatar, display_name } = userProfile;
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src={avatar}
          alt="User Avatar"
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            marginRight: "10px",
          }}
        />
        <span style={{ fontSize: "16px", fontWeight: "bold" }}>
          {display_name}
        </span>
      </div>
    );
  };
  let avatar: string | undefined;
  if ("avatar" in userProfile) {
    avatar = userProfile.avatar;
  }
  return (
    <div className="h-20">
      <div className="p-5 border-b flex items-center justify-between h-full">
        <div>
          {userProfile && avatar ? (
            renderAvatar()
          ) : (
            <h1 className="text-xl font-bold">Daily Chat</h1>
          )}
          <ChatPresence />
        </div>
        {userProfile && avatar ? (
          <Button onClick={handleLogout}>Logout</Button>
        ) : (
          <Button onClick={handleLoginWithGithub}>Login</Button>
        )}
      </div>
      {openLogin ? renderDialogDemo() : null}
    </div>
  );
}
