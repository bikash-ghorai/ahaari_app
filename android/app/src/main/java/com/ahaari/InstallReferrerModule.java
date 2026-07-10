package com.ahaari;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

import com.android.installreferrer.api.InstallReferrerClient;
import com.android.installreferrer.api.InstallReferrerStateListener;
import com.android.installreferrer.api.ReferrerDetails;

public class InstallReferrerModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;

    public InstallReferrerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "InstallReferrerModule";
    }

    @ReactMethod
    public void getReferrerString(Promise promise) {
        try {
            final InstallReferrerClient referrerClient = InstallReferrerClient.newBuilder(reactContext).build();
            referrerClient.startConnection(new InstallReferrerStateListener() {
                @Override
                public void onInstallReferrerSetupFinished(int responseCode) {
                    if (responseCode == InstallReferrerClient.InstallReferrerResponse.OK) {
                        try {
                            ReferrerDetails response = referrerClient.getInstallReferrer();
                            String referrerUrl = response.getInstallReferrer();
                            referrerClient.endConnection();
                            promise.resolve(referrerUrl); // Returns the query string to JS
                        } catch (Exception e) {
                            referrerClient.endConnection();
                            promise.reject("ERR_REFERRER", e.getMessage());
                        }
                    } else {
                        promise.resolve(""); // Referrer service unavailable or not installed via Play Store
                    }
                }

                @Override
                public void onInstallReferrerServiceDisconnected() {
                    // Fail gracefully if disconnected
                }
            });
        } catch (Exception e) {
            promise.reject("ERR_INIT", e.getMessage());
        }
    }
}