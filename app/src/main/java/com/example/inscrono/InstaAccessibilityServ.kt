package com.example.inscrono

import android.accessibilityservice.AccessibilityService
import android.view.accessibility.AccessibilityEvent

class InstaAccessibilityServ : AccessibilityService() {
    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        // check if on insta
        if (event?.packageName != "com.instagram.android") return
        // always block insta
        OverlayManager.show(this)
    }

    override fun onInterrupt() {
        TODO("Not yet implemented")
    }
}