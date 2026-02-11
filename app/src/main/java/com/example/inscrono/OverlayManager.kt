package com.example.inscrono

import android.content.Context
import android.graphics.Color
import android.graphics.PixelFormat
import android.view.View
import android.view.WindowManager

object OverlayManager {

    private var view: View? = null

    fun show(context: Context) {
        if (view != null) return

        val wm = context.getSystemService(Context.WINDOW_SERVICE) as WindowManager

        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
            PixelFormat.TRANSLUCENT
        )

        view = View(context).apply {
            setBackgroundColor(Color.BLACK)
        }

        wm.addView(view, params)
    }
}