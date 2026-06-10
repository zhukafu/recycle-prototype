#!/bin/bash
# 用照片级 prompt 重新下载所有文章内联图片
cd /Users/zhudb/Desktop/recycle-prototype/public/images/articles

fetch() {
    local file="$1"
    local prompt="$2"
    local size="${3:-landscape_16_9}"
    local encoded=$(python3 -c "import urllib.parse; print(urllib.parse.quote('''$prompt'''))" 2>/dev/null)
    if [ -z "$encoded" ]; then
        encoded=$(node -e "console.log(encodeURIComponent(process.argv[1]))" "$prompt" 2>/dev/null)
    fi
    if [ -z "$encoded" ]; then
        encoded=$(echo "$prompt" | sed 's/ /%20/g; s/,/%2C/g; s/:/%3A/g; s/;/%3B/g; s/(/%28/g; s/)/%29/g; s/\//%2F/g')
    fi
    local url="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encoded}&image_size=${size}"
    echo "Downloading $file..."
    curl -sL "$url" -o "$file" --max-time 60
    if [ -f "$file" ]; then
        echo "  -> $(ls -la "$file" | awk '{print $5}') bytes"
    fi
}

# ===== 资讯内联图 =====
# n1: 白银价格突破 - 行情图表
fetch "n1-inline.jpg" "Real photograph of Shanghai Gold Exchange trading screen displaying silver spot price chart with green and red candlesticks, real exchange trading floor atmosphere, news photography style, high resolution, authentic environment" "landscape_16_9"

# n2: 三元催化回收 - 三元催化器实物
fetch "n2-inline.jpg" "Real photograph of a used automotive three-way catalytic converter part being held by gloved hand, showing honeycomb ceramic structure inside stainless steel shell, recycled auto parts yard, authentic industrial documentary photography" "landscape_16_9"

# n3: 河北保定废料市场 - 现场拍摄
fetch "n3-inline.jpg" "Real photograph of Baoding China large-scale waste recycling market outdoor scene with piles of contactors relays and metal scrap on ground, busy workers, documentary street photography, natural daylight" "landscape_16_9"

# n4: 工信部政策 - 政策文件
fetch "n4-inline.jpg" "Real photograph of Chinese Ministry of Industry and Information Technology MIIT official website displayed on computer screen showing policy document, authentic screenshot style, government website interface" "landscape_16_9"

# n5: 贵金属深加工 - 深加工车间
fetch "n5-inline.jpg" "Real photograph of a precious metal refinery workshop interior with electrolytic cells, industrial tanks, copper wiring and silver anodes, authentic industrial documentary photography, worker present" "landscape_16_9"

# n6: 银价高位运行 - 价格走势
fetch "n6-inline.jpg" "Real photograph of financial trading monitor screen showing London silver spot price three-month rising line chart with data points, authentic professional trading desk environment, news photography" "landscape_16_9"

# ===== 知识内联图 =====
# k1: 接触器触点拆解
fetch "k1-inline.jpg" "Real close-up macro photograph of CJX2 AC contactor silver contact point being removed with precision tool on workbench, authentic repair workshop scene, technical documentation photography, shallow depth of field" "landscape_16_9"

# k2: 化学溶解法与电解法
fetch "k2-inline.jpg" "Real photograph of electrolytic refining cell for silver in laboratory, showing copper electrodes immersed in silver nitrate solution, blue-green liquid, real chemistry lab environment, documentary photography" "landscape_16_9"

# k3: 含银废料含银量参考
fetch "k3-inline.jpg" "Real photograph of assorted silver-containing waste materials spread on a workbench, including electrical contactors, relay contacts, solder pieces, X-ray films, organized for sorting, authentic recycler workspace" "landscape_16_9"

# k4: 废料回收前如何分类
fetch "k4-inline.jpg" "Real photograph of neatly sorted silver contactor parts in separate labeled bins, A grade B grade C grade, organized recycling workstation with gloves and tools, authentic small business environment" "landscape_16_9"

# k5: 硝酸溶解法操作要点
fetch "k5-inline.jpg" "Real photograph of laboratory glass beaker containing white silver chloride precipitate from chemical reaction, clear solution with white cloudy sediment, authentic chemistry lab scene with proper safety equipment" "landscape_16_9"

# k6: 如何鉴别真假银触点
fetch "k6-inline.jpg" "Real photograph of handheld XRF spectrometer analyzer being used to test silver contactor authenticity, professional quality inspection scene, modern laboratory equipment, authentic technical photography" "landscape_16_9"

echo ""
echo "===== Download complete ====="
ls -la /Users/zhudb/Desktop/recycle-prototype/public/images/articles/ | grep inline
