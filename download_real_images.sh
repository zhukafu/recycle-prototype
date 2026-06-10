#!/bin/bash
# 用 Pexels 直链（免 API key）下载真实照片。Pexels License：免费商用，无需署名。
# 24 张图 cover/inline 用不同 ID，确保唯一

cd /Users/zhudb/Desktop/recycle-prototype/public/images/articles

# 清理所有临时文件
rm -f *.tmp *.tmp.tmp 2>/dev/null

# 严格校验函数：必须是 JPG、>10KB
is_valid() {
    if [ ! -f "$1" ]; then return 1; fi
    sz=$(stat -f%z "$1" 2>/dev/null || stat -c%s "$1")
    head=$(xxd -l 4 -p "$1" 2>/dev/null)
    if [[ "$head" == ffd8ff* ]] && [ "$sz" -gt 10000 ]; then
        return 0
    fi
    return 1
}

# 下载单张
fetch_pexels() {
    target="$1"; shift
    rm -f "${target}.tmp"
    if is_valid "$target"; then
        echo "  skip  $target (already valid)"
        return 0
    fi
    for pid in "$@"; do
        url="https://images.pexels.com/photos/${pid}/pexels-photo-${pid}.jpeg?auto=compress&cs=tinysrgb&w=1200"
        echo "  fetching $target  ←  pexels $pid"
        curl -sL -A "Mozilla/5.0" --max-time 15 -o "${target}.tmp" "$url"
        if is_valid "${target}.tmp"; then
            mv "${target}.tmp" "$target"
            sz=$(stat -f%z "$target")
            echo "    -> $sz bytes  ✓"
            return 0
        fi
        rm -f "${target}.tmp"
    done
    echo "    -> 全部候选失败"
    return 1
}

# ===== 资讯封面 =====
fetch_pexels "n1-cover.jpg" 3617500 259165
fetch_pexels "n2-cover.jpg" 162553 3807277
fetch_pexels "n3-cover.jpg" 2884867 802221
fetch_pexels "n4-cover.jpg" 261949 2526105
fetch_pexels "n5-cover.jpg" 2227778 1108101
fetch_pexels "n6-cover.jpg" 210607 534216

# ===== 资讯内联 =====
fetch_pexels "n1-inline.jpg" 193484 192497
fetch_pexels "n2-inline.jpg" 3807277 3645554
fetch_pexels "n3-inline.jpg" 802221 433308
fetch_pexels "n4-inline.jpg" 1465050 1844547
fetch_pexels "n5-inline.jpg" 1108101 257736
fetch_pexels "n6-inline.jpg" 3617501 259165

# ===== 知识封面 =====
fetch_pexels "k1-cover.jpg" 1907227 257736
fetch_pexels "k2-cover.jpg" 2280549 3735709
fetch_pexels "k3-cover.jpg" 3735218 2884867
fetch_pexels "k4-cover.jpg" 159306 802221
fetch_pexels "k5-cover.jpg" 3735709 8326321
fetch_pexels "k6-cover.jpg" 8326321 3735709

# ===== 知识内联 =====
fetch_pexels "k1-inline.jpg" 257736 1907227
fetch_pexels "k2-inline.jpg" 8326321 2280549
fetch_pexels "k3-inline.jpg" 433308 802221
fetch_pexels "k4-inline.jpg" 802222 433308
fetch_pexels "k5-inline.jpg" 2280549 3735709
fetch_pexels "k6-inline.jpg" 4225921 3735709

rm -f *.tmp
echo ""
echo "===== 校验 ====="
total=$(ls *.jpg 2>/dev/null | wc -l | tr -d ' ')
unique=$(md5 -q *.jpg 2>/dev/null | sort -u | wc -l | tr -d ' ')
echo "总文件: $total / 24 | 唯一图: $unique / 24"
echo ""
echo "--- 缺失 ---"
for f in n1-cover.jpg n2-cover.jpg n3-cover.jpg n4-cover.jpg n5-cover.jpg n6-cover.jpg n1-inline.jpg n2-inline.jpg n3-inline.jpg n4-inline.jpg n5-inline.jpg n6-inline.jpg k1-cover.jpg k2-cover.jpg k3-cover.jpg k4-cover.jpg k5-cover.jpg k6-cover.jpg k1-inline.jpg k2-inline.jpg k3-inline.jpg k4-inline.jpg k5-inline.jpg k6-inline.jpg; do
    if [ ! -f "$f" ]; then
        echo "  $f"
    fi
done
echo ""
echo "--- 重复（出现多次的）---"
md5 -q *.jpg 2>/dev/null | sort | uniq -c | awk '$1 > 1' | head -10
