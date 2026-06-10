#!/bin/bash
# download_article_images.sh
# 为资讯/知识文章下载真实图片到本地

cd /Users/zhudb/Desktop/recycle-prototype/public/images/articles

# Helper function
fetch() {
    local file="$1"
    local prompt="$2"
    local size="${3:-landscape_16_9}"
    local encoded=$(python3 -c "import urllib.parse; print(urllib.parse.quote('''$prompt'''))" 2>/dev/null)
    if [ -z "$encoded" ]; then
        # fallback: use python from a different approach
        encoded=$(node -e "console.log(encodeURIComponent(process.argv[1]))" "$prompt" 2>/dev/null)
    fi
    if [ -z "$encoded" ]; then
        # last fallback: simple replace
        encoded=$(echo "$prompt" | sed 's/ /%20/g; s/,/%2C/g; s/:/%3A/g; s/;/%3B/g; s/(/%28/g; s/)/%29/g; s/\//%2F/g')
    fi
    local url="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encoded}&image_size=${size}"
    echo "Downloading $file..."
    curl -sL "$url" -o "$file" --max-time 60
    if [ -f "$file" ]; then
        echo "  -> $(ls -la "$file" | awk '{print $5}') bytes"
    fi
}

# ===== 资讯 (6 articles × 2 images = 12 images) =====

# n1: 白银价格突破 8000 元/千克
fetch "n1-cover.jpg" "Stack of shining silver bullion bars with price tag, professional product photography, clean white background, sharp focus, e-commerce style" "landscape_16_9"
fetch "n1-inline.jpg" "Close-up of silver ingot bar with engravement, professional studio lighting, clean white background, sharp focus" "landscape_16_9"

# n2: 三元催化回收市场
fetch "n2-cover.jpg" "Car catalytic converter honeycomb structure close-up, professional product photography, clean white background, sharp focus, e-commerce style" "landscape_16_9"
fetch "n2-inline.jpg" "Automotive exhaust catalytic converter steel shell, professional product photography, clean white background, sharp focus" "landscape_16_9"

# n3: 河北保定废料市场
fetch "n3-cover.jpg" "Industrial recycling warehouse with stacks of used contactors and metal scraps, professional industrial photography, natural lighting" "landscape_16_9"
fetch "n3-inline.jpg" "Heap of used AC contactors with exposed silver contacts, close-up industrial photography, shallow depth of field" "landscape_16_9"

# n4: 工信部政策
fetch "n4-cover.jpg" "Government policy document with official seal and pen, professional desk photography, warm lighting, official document on wooden desk" "landscape_16_9"
fetch "n4-inline.jpg" "Modern Chinese government building exterior with national flag, architectural photography, blue sky, official style" "landscape_16_9"

# n5: 贵金属深加工
fetch "n5-cover.jpg" "Silver refinery industrial facility with tanks and pipes, professional industrial photography, factory floor view" "landscape_16_9"
fetch "n5-inline.jpg" "Molten silver pouring into ingot mold, professional industrial photography, dramatic lighting, sparks and glow" "landscape_16_9"

# n6: 银价高位运行
fetch "n6-cover.jpg" "Stock market price chart on digital display showing rising trend, professional finance photography, modern trading screen" "landscape_16_9"
fetch "n6-inline.jpg" "Pile of silver coins and small silver bars, professional product photography, clean white background, sharp focus" "landscape_16_9"

# ===== 知识 (6 articles × 2 images = 12 images) =====

# k1: 接触器触点如何快速无损拆卸
fetch "k1-cover.jpg" "Close-up of electrical contactor with silver contact point being disassembled, professional technical photography, clean workbench" "landscape_16_9"
fetch "k1-inline.jpg" "AC contactor silver contact pieces arranged on white background, professional product photography, e-commerce style" "landscape_16_9"

# k2: 化学溶解法与电解法
fetch "k2-cover.jpg" "Chemistry laboratory beaker with silver nitrate solution, professional scientific photography, clean lab background" "landscape_16_9"
fetch "k2-inline.jpg" "Electrolytic refining cell for precious metals, professional industrial photography, copper and silver electrodes" "landscape_16_9"

# k3: 含银废料含银量参考表
fetch "k3-cover.jpg" "Various silver-bearing waste materials arranged in a row, electrical components and solder pieces, professional product photography" "landscape_16_9"
fetch "k3-inline.jpg" "Sorted piles of silver contactors and electrical components, professional product photography, clean background" "landscape_16_9"

# k4: 废料回收前如何分类
fetch "k4-cover.jpg" "Color-coded sorting bins with different metal scrap categories, professional industrial photography, organized recycling" "landscape_16_9"
fetch "k4-inline.jpg" "Worker hands sorting silver contactor parts, close-up industrial photography, gloved hands" "landscape_16_9"

# k5: 硝酸溶解法操作要点
fetch "k5-cover.jpg" "Chemistry lab nitric acid solution in glass beaker with safety equipment, professional scientific photography" "landscape_16_9"
fetch "k5-inline.jpg" "Silver chloride precipitate in laboratory beaker, professional scientific photography, chemical reaction in progress" "landscape_16_9"

# k6: 如何鉴别真假银触点
fetch "k6-cover.jpg" "Comparison side by side of genuine silver contact and fake plated contact on white background, professional product photography" "landscape_16_9"
fetch "k6-inline.jpg" "Spectrometer XRF device testing silver contact authenticity, professional industrial photography, lab equipment" "landscape_16_9"

echo ""
echo "===== Download complete ====="
ls -la /Users/zhudb/Desktop/recycle-prototype/public/images/articles/
