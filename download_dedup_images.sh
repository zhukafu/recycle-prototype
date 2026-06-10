#!/bin/bash
# 为 11 个文件下载 11 张全新唯一 Pexels 图片
# 兼容 bash 3.2 (macOS): 用临时文件记录已用 hash
cd /Users/zhudb/Desktop/recycle-prototype/public/images/articles

USED_HASH_FILE=$(mktemp)
trap "rm -f $USED_HASH_FILE *.tmp" EXIT

# 收集已用 hash
for f in *.jpg; do
    [ -f "$f" ] && md5 -q "$f" >> "$USED_HASH_FILE"
done

is_valid() {
    if [ ! -f "$1" ]; then return 1; fi
    sz=$(stat -f%z "$1" 2>/dev/null || stat -c%s "$1")
    head=$(xxd -l 4 -p "$1" 2>/dev/null)
    if [[ "$head" == ffd8ff* ]] && [ "$sz" -gt 10000 ]; then return 0; fi
    return 1
}

is_hash_used() {
    grep -qx "$1" "$USED_HASH_FILE"
}

fetch_unique() {
    target="$1"; shift
    rm -f "${target}.tmp"
    if is_valid "$target"; then echo "  skip  $target"; return 0; fi
    for pid in "$@"; do
        url="https://images.pexels.com/photos/${pid}/pexels-photo-${pid}.jpeg?auto=compress&cs=tinysrgb&w=1200"
        echo "  fetching $target  ←  pexels $pid"
        curl -sL -A "Mozilla/5.0" --max-time 15 -o "${target}.tmp" "$url"
        if is_valid "${target}.tmp"; then
            h=$(md5 -q "${target}.tmp")
            if ! is_hash_used "$h"; then
                mv "${target}.tmp" "$target"
                echo "$h" >> "$USED_HASH_FILE"
                sz=$(stat -f%z "$target")
                echo "    -> $sz bytes  ✓  hash=$h"
                return 0
            else
                echo "    -> 重复 hash=$h, 尝试下一个"
            fi
        fi
        rm -f "${target}.tmp"
    done
    echo "    -> 全部候选失败"
    return 1
}

# 已验证可用 ID 池：1267338 2569842 442150 356056 1108572 4116193 3855960 3855961
#                   5762502 3680283 3825572 4480505 4480506 4480473 4480523
#                   4480510 4480527 3825245 3825244 261949 1108101 193484 2280549
#                   2884867 3735709 3807277 433308 257736 5778893 534216 2526105
#                   1844547 192497 4480434 4480435

# 11 个文件，每张 6 个候选
fetch_unique "k1-inline.jpg" 1267338 2569842 442150 356056 1108572 4116193
fetch_unique "k2-inline.jpg" 3855960 3855961 5762502 3680283 3825572 4480505
fetch_unique "k3-inline.jpg" 4480506 4480473 4480523 4480510 4480527 3825245
fetch_unique "k5-inline.jpg" 3825244 261949 1108101 193484 2280549 2884867
fetch_unique "k6-inline.jpg" 3735709 3807277 433308 257736 5778893 534216
fetch_unique "n1-cover.jpg"  2526105 1844547 192497 4480434 4480435 1267338
fetch_unique "n2-inline.jpg" 2569842 442150 356056 1108572 4116193 3855960
fetch_unique "n3-cover.jpg"  3855961 5762502 3680283 3825572 4480505 4480506
fetch_unique "n3-inline.jpg" 4480473 4480523 4480510 4480527 3825245 3825244
fetch_unique "n5-inline.jpg" 261949 1108101 193484 2280549 2884867 3735709
fetch_unique "n6-inline.jpg" 3807277 433308 257736 5778893 534216 2526105

rm -f *.tmp
echo ""
echo "===== 校验 ====="
total=$(ls *.jpg 2>/dev/null | wc -l | tr -d ' ')
unique=$(md5 -q *.jpg 2>/dev/null | sort -u | wc -l | tr -d ' ')
echo "总文件: $total / 24 | 唯一图: $unique / 24"
echo ""
echo "--- 缺失 ---"
for f in n1-cover.jpg n2-cover.jpg n3-cover.jpg n4-cover.jpg n5-cover.jpg n6-cover.jpg n1-inline.jpg n2-inline.jpg n3-inline.jpg n4-inline.jpg n5-inline.jpg n6-inline.jpg k1-cover.jpg k2-cover.jpg k3-cover.jpg k4-cover.jpg k5-cover.jpg k6-cover.jpg k1-inline.jpg k2-inline.jpg k3-inline.jpg k4-inline.jpg k5-inline.jpg k6-inline.jpg; do
    [ ! -f "$f" ] && echo "  $f"
done
echo ""
echo "--- 重复 ---"
md5 -q *.jpg 2>/dev/null | sort | uniq -c | awk '$1 > 1'
