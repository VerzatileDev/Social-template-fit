/* =====================================================================
   TEMPLATES: the only file you need to edit to change platforms/templates.

   Each template is one object:
     name   Label shown in the picker (must be unique within its platform)
     w, h   Size in pixels
     gif    GifS  = animated GIF works
            GifMS = maybe / unreliable
            GifNS = still image only            (default)
     vid    VidS  = MP4 works
            VidMS = maybe
            VidNS = no MP4                      (default)
     hint   Optional note (video specs, limits, tips), shown under the preview
     zones  Optional overlay areas the platform covers, as fractions of the image:
            { label, x, y, w, h }

   Each platform can also have:
     maxMB  Upload size limit; exports are auto-reduced to fit it
   ===================================================================== */

// Template selected on first load (falls back to the first template if not found)
const DEFAULT_TEMPLATE = ["Facebook", "Event cover photo 1.91:1"];

const PLATFORMS = {
  Facebook: {
    templates: [
      { name: "Page cover photo 2.62:1", w: 1640, h: 642 },
      { name: "Event cover photo 1.91:1", w: 1920, h: 1005 },
      { name: "Profile image 1:1", w: 1200, h: 1200 },
      {
        name: "Square post 1:1",
        w: 1440,
        h: 1440,
        gif: "GifMS",
        vid: "VidS",
        hint: "MP4 (H.264). Square or vertical fits feeds best.",
      },
      {
        name: "Portrait post 4:5",
        w: 1440,
        h: 1800,
        gif: "GifMS",
        vid: "VidS",
        hint: "MP4 (H.264). Square or vertical fits feeds best.",
      },
      {
        name: "Landscape post 16:9",
        w: 1092,
        h: 1080,
        gif: "GifMS",
        vid: "VidS",
        hint: "MP4 (H.264). Square or vertical fits feeds best.",
      },
      { name: "Shared Link preview 1.91:1", w: 1200, h: 630 },
      {
        name: "Story / Reel 9:16",
        w: 1440,
        h: 2560,
        vid: "VidS",
        hint: "MP4, 1080×1920, 1–60 s per story.",
      },
    ],
  },

  Instagram: {
    templates: [
      { name: "Profile image 1:1", w: 1200, h: 1200 },
      {
        name: "Square post 1:1",
        w: 1080,
        h: 1080,
        vid: "VidS",
        hint: "MP4 or MOV, 1080 px wide.",
      },
      {
        name: "Portrait post 4:5",
        w: 1080,
        h: 1350,
        vid: "VidS",
        hint: "MP4 or MOV, 1080 px wide.",
      },
      {
        name: "Tall portrait post 3:4",
        w: 1080,
        h: 1440,
        vid: "VidS",
        hint: "MP4 or MOV, 1080 px wide.",
      },
      {
        name: "Landscape post 1.91:1",
        w: 1080,
        h: 566,
        vid: "VidS",
        hint: "MP4 or MOV, 1080 px wide.",
      },
      {
        name: "Carousel post 3:4",
        w: 1080,
        h: 1440,
        vid: "VidS",
        hint: "MP4 or MOV, 1080 px wide.",
      },
      {
        name: "Story 9:16",
        w: 1080,
        h: 1920,
        vid: "VidS",
        hint: "MP4 or MOV, 1080×1920, up to 60 s. GIFs only work as stickers.",
      },
      {
        name: "Reel 9:16",
        w: 1080,
        h: 1920,
        vid: "VidS",
        hint: "MP4 or MOV, 1080×1920.",
      },
      { name: "Reel cover 9:16", w: 1080, h: 1920 },
      { name: "Highlight cover 1:1", w: 1200, h: 1200 },
      { name: "Profile grid preview 3:4", w: 1080, h: 1440 },
    ],
  },

  "X / Twitter": {
    templates: [
      { name: "Profile image 1:1", w: 400, h: 400 },
      { name: "Header banner 3:1", w: 1500, h: 500 },
      {
        name: "Square post 1:1",
        w: 2048,
        h: 2048,
        gif: "GifS",
        vid: "VidS",
        hint: "MP4, up to about 140 s and 512 MB.",
      },
      {
        name: "Landscape post 16:9",
        w: 1920,
        h: 1080,
        gif: "GifS",
        vid: "VidS",
        hint: "MP4, up to about 140 s and 512 MB.",
      },
      {
        name: "Portrait post 3:4",
        w: 1080,
        h: 1440,
        gif: "GifS",
        vid: "VidS",
        hint: "MP4, up to about 140 s and 512 MB.",
      },
      {
        name: "Link preview 2:1",
        w: 4096,
        h: 2048,
        hint: "If a GIF is used, only its first frame shows.",
      },
      {
        name: "Video post 16:9",
        w: 1920,
        h: 1080,
        vid: "VidS",
        hint: "MP4, up to about 140 s and 512 MB.",
      },
      {
        name: "Vertical video 9:16",
        w: 1080,
        h: 1920,
        vid: "VidS",
        hint: "MP4, up to about 140 s and 512 MB.",
      },
    ],
  },

  LinkedIn: {
    templates: [
      { name: "Personal profile image 1:1", w: 1200, h: 1200 },
      { name: "Personal cover banner 4:1", w: 1584, h: 396 },
      { name: "Company logo 1:1", w: 1200, h: 1200 },
      { name: "Company cover banner 5.91:1", w: 1512, h: 256 },
      {
        name: "Square post 1:1",
        w: 1200,
        h: 1200,
        gif: "GifS",
        vid: "VidS",
        hint: "MP4, 3 s to 30 min, up to 5 GB.",
      },
      {
        name: "Portrait post 4:5",
        w: 1200,
        h: 1500,
        gif: "GifS",
        vid: "VidS",
        hint: "MP4, 3 s to 30 min, up to 5 GB.",
      },
      {
        name: "Landscape post 1.91:1",
        w: 1200,
        h: 627,
        gif: "GifS",
        vid: "VidS",
        hint: "MP4, 3 s to 30 min, up to 5 GB.",
      },
      { name: "Link preview 1.91:1", w: 1200, h: 627 },
      { name: "Article cover 16:9", w: 1920, h: 1080 },
      {
        name: "Video post 16:9",
        w: 1920,
        h: 1080,
        vid: "VidS",
        hint: "MP4, 3 s to 30 min, up to 5 GB.",
      },
    ],
  },

  YouTube: {
    templates: [
      { name: "Channel profile image 1:1", w: 1200, h: 1200 },
      { name: "Channel banner 16:9", w: 2560, h: 1440 },
      { name: "Video thumbnail 16:9", w: 3840, h: 2160 },
      { name: "Shorts thumbnail 9:16", w: 2160, h: 3840 },
      {
        name: "Video 16:9",
        w: 3840,
        h: 2160,
        vid: "VidS",
        hint: "MP4, 3840×2160.",
      },
      {
        name: "Shorts video 9:16",
        w: 2160,
        h: 3840,
        vid: "VidS",
        hint: "MP4, 2160×3840.",
      },
      { name: "Video watermark 1:1", w: 1000, h: 1000 },
    ],
  },

  Bluesky: {
    templates: [
      { name: "Profile image 1:1", w: 1200, h: 1200 },
      { name: "Profile banner 3:1", w: 1500, h: 500 },
      {
        name: "Square post 1:1",
        w: 2000,
        h: 2000,
        gif: "GifS",
        vid: "VidS",
        hint: "MP4, up to about 3 min and 100 MB.",
      },
      {
        name: "Landscape post 16:9",
        w: 1920,
        h: 1080,
        gif: "GifS",
        vid: "VidS",
        hint: "MP4, up to about 3 min and 100 MB.",
      },
      {
        name: "Portrait post 9:16",
        w: 1080,
        h: 1920,
        gif: "GifS",
        vid: "VidS",
        hint: "MP4, up to about 3 min and 100 MB.",
      },
      {
        name: "Video post 9:16",
        w: 1080,
        h: 1920,
        vid: "VidS",
        hint: "MP4, up to about 3 min and 100 MB.",
      },
      { name: "Link preview 1.91:1", w: 1200, h: 630 },
    ],
  },

  ArtStation: {
    maxMB: 10,
    templates: [
      { name: "Profile image 1:1", w: 1200, h: 1200 },
      { name: "Profile background 3:1", w: 2560, h: 640 },
      {
        name: "Artwork image 1:1",
        w: 3840,
        h: 3840,
        hint: "Over 400×400, up to 10,000×10,000 px, under 10 MB. 3840 px wide JPG at 100% is recommended.",
      },
      {
        name: "Artwork landscape 16:9",
        w: 3840,
        h: 2160,
        hint: "Over 400×400, up to 10,000×10,000 px, under 10 MB. 3840 px wide JPG at 100% is recommended.",
      },
      {
        name: "Artwork portrait 3:4",
        w: 2880,
        h: 3840,
        hint: "Over 400×400, up to 10,000×10,000 px, under 10 MB. 3840 px wide JPG at 100% is recommended.",
      },
      { name: "Project cover 16:9", w: 3840, h: 2160 },
      {
        name: "Video clip 16:9",
        w: 3840,
        h: 2160,
        vid: "VidS",
        hint: "MP4. 2K for free accounts, 4K for Premium.",
      },
      {
        name: "Video clip vertical 9:16",
        w: 2160,
        h: 3840,
        vid: "VidS",
        hint: "MP4. 2K for free accounts, 4K for Premium.",
      },
    ],
  },

  "Ko-fi": {
    templates: [
      { name: "Profile image 1:1", w: 1200, h: 1200 },
      { name: "Cover banner 3:1", w: 1200, h: 400 },
      {
        name: "Square post 1:1",
        w: 2000,
        h: 2000,
        gif: "GifS",
        vid: "VidMS",
        hint: "GIF: 20 MB free, 50 MB Contributor. Under 250 KB animates in the feed, up to 4 MB when opened, above 4 MB it doesn't animate. MP4 isn't a reliable direct upload.",
      },
      {
        name: "Portrait post 4:5",
        w: 1600,
        h: 2000,
        gif: "GifS",
        vid: "VidMS",
        hint: "GIF: 20 MB free, 50 MB Contributor. Under 250 KB animates in the feed, up to 4 MB when opened, above 4 MB it doesn't animate. MP4 isn't a reliable direct upload.",
      },
      {
        name: "Landscape post 16:9",
        w: 1920,
        h: 1080,
        gif: "GifS",
        vid: "VidMS",
        hint: "GIF: 20 MB free, 50 MB Contributor. Under 250 KB animates in the feed, up to 4 MB when opened, above 4 MB it doesn't animate. MP4 isn't a reliable direct upload.",
      },
      {
        name: "Gallery artwork 1:1",
        w: 2000,
        h: 2000,
        gif: "GifS",
        vid: "VidMS",
        hint: "GIF: 20 MB free, 50 MB Contributor. Under 250 KB animates in the feed, up to 4 MB when opened, above 4 MB it doesn't animate. MP4 isn't a reliable direct upload.",
      },
      {
        name: "Commission artwork 1:1",
        w: 2000,
        h: 2000,
        gif: "GifS",
        vid: "VidMS",
        hint: "GIF: 20 MB free, 50 MB Contributor. Under 250 KB animates in the feed, up to 4 MB when opened, above 4 MB it doesn't animate. MP4 isn't a reliable direct upload.",
      },
      {
        name: "Shop product image 1:1",
        w: 2000,
        h: 2000,
        gif: "GifS",
        vid: "VidMS",
        hint: "GIF: 20 MB free, 50 MB Contributor. Under 250 KB animates in the feed, up to 4 MB when opened, above 4 MB it doesn't animate. MP4 isn't a reliable direct upload.",
      },
      {
        name: "Membership tier image 1:1",
        w: 1200,
        h: 1200,
        gif: "GifS",
        vid: "VidMS",
        hint: "GIF: 20 MB free, 50 MB Contributor. Under 250 KB animates in the feed, up to 4 MB when opened, above 4 MB it doesn't animate. MP4 isn't a reliable direct upload.",
      },
    ],
  },

  Reddit: {
    templates: [
      { name: "Profile avatar 1:1", w: 1200, h: 1200 },
      { name: "Profile banner 10:3", w: 1920, h: 576 },
      {
        name: "Community banner",
        w: 2160,
        h: 256,
        hint: "At least 1072×128 on desktop and 1080×128 on mobile.",
      },
      {
        name: "Square post 1:1",
        w: 2048,
        h: 2048,
        gif: "GifMS",
        vid: "VidS",
        hint: "GIF support depends on the posting method and community.",
      },
      {
        name: "Portrait post 4:5",
        w: 1440,
        h: 1800,
        gif: "GifMS",
        vid: "VidS",
        hint: "GIF support depends on the posting method and community.",
      },
      {
        name: "Landscape post 16:9",
        w: 1920,
        h: 1080,
        gif: "GifMS",
        vid: "VidS",
        hint: "GIF support depends on the posting method and community.",
      },
      { name: "Link preview 1.91:1", w: 1200, h: 630 },
      { name: "Video post 16:9", w: 1920, h: 1080, vid: "VidS" },
      { name: "Vertical video 9:16", w: 1080, h: 1920, vid: "VidS" },
    ],
  },

  /* Mastodon limits vary per server. GIFs must be under 1 megapixel and are
     converted to silent MP4, so the larger GIF templates are marked GifMS. */
  Mastodon: {
    maxMB: 16,
    templates: [
      {
        name: "Profile avatar 1:1",
        w: 1200,
        h: 1200,
        gif: "GifMS",
        hint: "Downscaled to 400×400. GIFs must be under 1 megapixel.",
      },
      {
        name: "Profile header 3:1",
        w: 1500,
        h: 500,
        gif: "GifS",
        hint: "Downscaled to 1500×500.",
      },
      {
        name: "Square post 1:1",
        w: 3840,
        h: 3840,
        gif: "GifMS",
        vid: "VidS",
        hint: "Images are downscaled to about 8.3 MP. GIFs must be under 1 MP and become silent MP4. Videos up to 99 MB.",
      },
      {
        name: "Landscape post 16:9",
        w: 3840,
        h: 2160,
        gif: "GifMS",
        vid: "VidS",
        hint: "Images are downscaled to about 8.3 MP. GIFs must be under 1 MP and become silent MP4. Videos up to 99 MB.",
      },
      {
        name: "Portrait post 9:16",
        w: 2160,
        h: 3840,
        gif: "GifMS",
        vid: "VidS",
        hint: "Images are downscaled to about 8.3 MP. GIFs must be under 1 MP and become silent MP4. Videos up to 99 MB.",
      },
      {
        name: "Video post 16:9",
        w: 3840,
        h: 2160,
        vid: "VidS",
        hint: "Videos up to 99 MB.",
      },
      {
        name: "Vertical video 9:16",
        w: 2160,
        h: 3840,
        vid: "VidS",
        hint: "Videos up to 99 MB.",
      },
    ],
  },

  "itch.io": {
    maxMB: 3,
    templates: [
      {
        name: "Cover image",
        w: 1920,
        h: 1524,
        gif: "GifS",
        zones: [{ label: "GIF label", x: 0.01, y: 0.02, w: 0.14, h: 0.11 }],
      },
      { name: "Screenshot 16:9", w: 1920, h: 1080, gif: "GifS" },
      { name: "Screenshot 4:3", w: 1200, h: 900, gif: "GifS" },
      { name: "Screenshot 3:4 (portrait)", w: 900, h: 1200, gif: "GifS" },
      { name: "Screenshot 1:1", w: 800, h: 800, gif: "GifS" },
      { name: "Page banner", w: 2048, h: 880, gif: "GifS" },
      { name: "MetadataHeader image", w: 960, h: 400, gif: "GifMS" },
      { name: "Metadata Wide cover (21:9)", w: 2100, h: 900 },
      {
        name: "Metadata Social media image",
        w: 1200,
        h: 630,
        gif: "GifMS",
        zones: [
          { label: "May crop", x: 0, y: 0, w: 0.2417, h: 1 },
          { label: "May crop", x: 0.7583, y: 0, w: 0.2417, h: 1 },
        ],
      },
      { name: "Profile /Metadata favicon", w: 500, h: 500 },
    ],
  },

  "Unity Asset Store": {
    templates: [
      {
        name: "Key image / cover 3:2",
        w: 1200,
        h: 800,
        hint: "Follow Unity's key image safe-zone templates.",
      },
      {
        name: "Screenshot 3:2",
        w: 2400,
        h: 1600,
        hint: "At least 1200 px wide. 2400×1600 is recommended.",
      },
      {
        name: "Screenshot landscape 16:9",
        w: 2560,
        h: 1440,
        hint: "At least 1200 px wide. Buyers can view it at full resolution.",
      },
      {
        name: "Screenshot portrait 3:4",
        w: 2400,
        h: 3200,
        hint: "At least 1200 px wide. Buyers can view it at full resolution.",
      },
      { name: "Product icon 1:1", w: 1200, h: 1200 },
      { name: "Promotional graphic 3:2", w: 2400, h: 1600 },
    ],
  },

  /* 3D model previews (native 3D assets) have no pixel size, so they aren't listed. */
  "Epic / Fab": {
    maxMB: 3,
    templates: [
      {
        name: "Product thumbnail 16:9",
        w: 1920,
        h: 1080,
        hint: "JPG or PNG, minimum 1920×1080, under 3 MB each, under 25 MB for the whole gallery.",
      },
      {
        name: "Gallery image 16:9",
        w: 1920,
        h: 1080,
        hint: "JPG or PNG, minimum 1920×1080, under 3 MB each, under 25 MB for the whole gallery.",
      },
      {
        name: "Product screenshot 16:9",
        w: 2560,
        h: 1440,
        hint: "JPG or PNG, under 3 MB each, under 25 MB for the whole gallery.",
      },
      {
        name: "Promotional image 16:9",
        w: 1920,
        h: 1080,
        hint: "JPG or PNG, minimum 1920×1080, under 3 MB each, under 25 MB for the whole gallery.",
      },
      {
        name: "Demonstration video 16:9",
        w: 1920,
        h: 1080,
        vid: "VidS",
        hint: "1920×1080 MP4, MOV or WEBM, up to 300 MB.",
      },
      {
        name: "Showcase video 16:9",
        w: 1920,
        h: 1080,
        vid: "VidS",
        hint: "1920×1080 MP4, MOV or WEBM, up to 300 MB.",
      },
    ],
  },
  Steam: {
    templates: [
      // Store assets
      {
        name: "Header capsule",
        w: 920,
        h: 430,
        hint: "Required. Logo and artwork only, no extra text. Smaller versions are generated from this.",
        zones: [
          {
            label: "Download badge",
            x: 0,
            y: 0.0,
            w: 0.2283,
            h: 0.5,
          },
          {
            label: [
              "Banner overlay area",
              "Background artwork may extend into this area. Keep logos, text, and other important visual elements below.",
            ],
            x: 0,
            y: 0,
            w: 1.0,
            h: 0.1,
          },
        ],
      },

      {
        name: "Small capsule",
        w: 462,
        h: 174,
        hint: "Required. Logo must stay legible at 120×45 and 184×69, so make it nearly fill the frame.",
        zones: [
          {
            label: "Download badge",
            x: 0,
            y: 0,
            w: 0.2468,
            h: 0.6494,
            fontSize: 10,
          },
          {
            label: ["Banner overlay: Keep clear of important visual elements."],
            x: 0,
            y: 0,
            w: 1.0,
            h: 0.1,
          },
        ],
      },

      {
        name: "Main capsule",
        w: 1232,
        h: 706,
        hint: "Required. Logo and artwork only, no extra text.",
        zones: [
          {
            label: "Download badge",
            x: 0,
            y: 0.0,
            w: 0.18,
            h: 0.3,
          },
          {
            label: [
              "Banner overlay area",
              "Background artwork may extend into this area.",
              "Keep logos, text, and other important visual elements below.",
            ],
            x: 0,
            y: 0,
            w: 1.0,
            h: 0.1,
            fontSize: 18,
          },
        ],
      },

      {
        name: "Vertical capsule",
        w: 748,
        h: 896,
        hint: "Do not include quotes or other strings of text beyond the title of your game. The game's logotype should be easily legible against the background.",
        zones: [
          {
            label: [
              "Banner overlay area",
              "Background artwork may extend into this area.",
              "Keep logos, text, and other important visual elements below.",
            ],
            x: 0,
            y: 0,
            w: 1.0,
            h: 0.1,
          },
        ],
      },

      {
        name: "Header Capsule (Bundle)",
        w: 1414,
        h: 464,
        hint: "Only needed if you make a bundle. Template is 1414×464 (the docs page lists half-size 707×232). Keep logos and text below the banner overlay.",
        zones: [
          {
            label: [
              "Banner overlay area: Background artwork may extend into this area.",
            ],
            x: 0,
            y: 0,
            w: 1,
            h: 0.0991,
            fontSize: 44,
          },
        ],
      },

      {
        name: "Library capsule",
        w: 600,
        h: 900,
        hint: "Just your game logo and artwork.",
        zones: [
          {
            label: "Occasional block",
            x: 0,
            y: 0,
            w: 1,
            h: 0.0611,
            fontSize: 24,
          },
          {
            label: [
              "These specs are sometimes covered.",
              "Avoid important features such as faces or logos.",
            ],
            x: 0,
            y: 0.9044,
            w: 1,
            h: 0.0956,
            fontSize: 18,
          },
          { label: "", x: 0, y: 0.0611, w: 0.03, h: 0.8433 },
          { label: "", x: 0.9717, y: 0.0611, w: 0.0283, h: 0.8433 },
          {
            label: ["Download", "icon"],
            x: 0.03,
            y: 0.8433,
            w: 0.2017,
            h: 0.0611,
            fontSize: 18,
          },
        ],
      },

      {
        name: "Library Logo",
        w: 1280,
        h: 720,
        hint: " Just your game logo. Will be displayed on top of Hero Graphic.",
      },

      {
        name: "Library Header",
        w: 920,
        h: 430,
        hint: " Just your game logo and artwork ",
      },

      {
        name: "Library hero",
        w: 3840,
        h: 1240,
        hint: "Required. PNG. Artwork only, no text. Extend artwork across the entire template. Keep all critical content inside the central safe area.",
        zones: [
          {
            label: "Keep all critical content in the safe area",
            x: 0,
            y: 0,
            w: 0.38802,
            h: 1,
            fontSize: 64,
          },
          {
            label: "Keep all critical content in the safe area",
            x: 0.61198,
            y: 0,
            w: 0.38802,
            h: 1,
            fontSize: 64,
          },
          {
            label: "Potential crop area",
            x: 0.38802,
            y: 0,
            w: 0.22396,
            h: 0.34677,
            fontSize: 64,
          },
          {
            label: "",
            x: 0.38802,
            y: 0.65323,
            w: 0.22396,
            h: 0.34677,
            fontSize: 64,
          },
        ],
      },

      {
        name: "Event Cover",
        w: 800,
        h: 450,
        hint: " This image should primarily contain the artwork and branding for your event.",
      },

      {
        name: "Event header",
        w: 1920,
        h: 622,
        hint: "Suggested. Keep logo and critical text inside the center box (y 114–495). Artwork should bleed into the top and bottom bands.",
      },

      {
        name: "Shortcut icon",
        w: 256,
        h: 256,
        hint: "Game seen on desktop as app icon on upload converted to .ico",
      },
    ],
  },
};
