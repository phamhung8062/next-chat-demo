"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import ChatPresence from "./ChatPresence";
import { getFinalLocationAndCookies } from "@/lib/apiClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Data,
  DataWaittingScan,
  getLoginInfo,
  getQrcode,
  getWaittingScan,
  getWaittingScanConfirm,
  getZaloSession,
  getZpid,
  veryfifyClient,
} from "@/src/service/LoginService";
import { getImei } from "@/lib/utils";
import { LoginInfoModel } from "@/src/service/LoginInfoModel";

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
            getLoginInfoData();
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
            localStorageToCookies();
            getFinalLocationAndCookies();
            getLoginInfoData();
          } else {
            console.log("Waiting scan did not succeed:", qrResponse);
          }
        }
      }
    }
  };

  const getLoginInfoData = async () => {
    var userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36";
    var imei = getImei(userAgent);
    console.log("imei", imei);
    const loginInfoModel = new LoginInfoModel({
      type: 30,
      imei: imei,
      firstLaunchTime: Date.now(),
    });
    const object: string=`{"imei":${imei},"computer_name":"Web","language":"vi","ts":${Date.now()}}`;
    const encryptKey: string=loginInfoModel.getEncryptKey() || "";
    console.log("encryptKey",encryptKey);
    const params: string =LoginInfoModel.encodeAES(
      encryptKey,
      object,
      "base64",
      false
    ) || "";
    console.log("paramUrl",params);
    var zcid =loginInfoModel.zcid ||
      "61359529F7EB5D5FABC3DE7675F0A1F3252F150B8A9EBFB3F0A1F55BCBF2F29AC609002EBE0EF4A31CD84E260B9FB7F6EC732EC25EE0EEC6541040D455D52DAFA2B4BCC3EDA82CD02F214DBEEF5E3018E6430387F3B785EC492195F10205EDD6";
    var zcidExt = loginInfoModel.zcid_ext || "65fc2f";
    // var params =
      // "DqK6WSnpfa21o5p97otUzZaH6AX0lR3ifmtyB6kObm4FzMZAgNHosTE86uCD12VpfYxsrBopYo7BYSS0QDjwbFcSoyF%2FoHHdtPX5559RfpzkwBbX49wqqm2aHAMZ0wGIjA6IvaMlgs7DvJ23mnaI%2FGLQ%2FgFkVGsp9gVWVSRnhlzd96ZIrh2yOk%2BPanuNbf9f";
    const loginInfoData = await getLoginInfo(zcid, zcidExt, params);
    console.log("loginInfoData", loginInfoData);
  };

  const loginSuccess = async () => {
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
