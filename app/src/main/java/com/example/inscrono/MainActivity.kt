package com.example.inscrono

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.provider.Settings
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.example.inscrono.ui.theme.InscroNoTheme
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            InscroNoTheme {
            }
            Button(
                onClick = { showOverlay() },
                modifier = Modifier.fillMaxSize()
            ) {
                Text("Show Overlay")
            }
        }
    }

    private fun showOverlay() {
        if (!Settings.canDrawOverlays(this)) {
            val intent = Intent(
                Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                Uri.parse("package:$packageName")
            )
            startActivity(intent)
            return
        }
        OverlayManager.show(this)
    }
}

@Composable
fun Greeting(name: String, modifier: Modifier = Modifier) {
    Text(
//        text = "Hello there!",
        text = "Hello $name!",
        modifier = modifier
    )
}

@Preview(showBackground = true)
@Composable
fun GreetingPreview() {
    InscroNoTheme {
        Greeting("Android")
    }
}
//
//@Composable
//fun ListItem(name: String) { // fun: method
//    Card(
//        modifier = Modifier
//            .fillMaxSize()
//            .padding(12.dp)
//    ) {
//        Row {
//            Image(
//                painter = painterResource(id = R.drawable.baseline_person_24),
//                "Photo of person",
//                modifier = Modifier.width(100.dp)
//                    .height(100.dp)
//            )
//            Text(
//                text = name,
//                modifier = Modifier.padding(24.dp)
//            )
//        }
//
//    }
//
//}