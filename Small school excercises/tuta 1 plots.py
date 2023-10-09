import numpy as np
import matplotlib.pyplot as plt


people_per_day = np.array([13700, 10000, 7500, 13700, 13700, 10000, 7500, 13700, 4 * 13700, 4 * 13700])
buyer_precentage = np.array([0.001, 0.002, 0.007, 0.01, 0.012, 0.015, 0.02, 0.02, 0.02, 0.02])

buys_per_quarter = 3 * 20 * people_per_day * buyer_precentage
revenue_per_quarter = 5 * buys_per_quarter

quarter = np.array([1, 2, 3, 4, 5, 6, 7, 8, 12, 16])

fig, ax1 = plt.subplots()


# Plot the first dataset on the left y-axis
ax1.semilogy(quarter, buys_per_quarter, "o", color='tab:blue', label='myytyjen tuotteiden määrä')
ax1.set_xlabel('kvartaali', fontsize=24)
ax1.set_ylabel('myydyt tuotteet', color='tab:blue', fontsize=24)
ax1.tick_params(axis='y', colors='tab:blue')

ax1.set_ylim([500, 70000])

# Create a second y-axis that shares the same x-axis
ax2 = ax1.twinx()

# Plot the second dataset on the right y-axis
ax2.semilogy(quarter, revenue_per_quarter, "o", color='tab:red', label='kvarttaalittainen liikevaihto')
ax2.set_ylabel('liikevaihto', color='tab:red', fontsize=24)
ax2.tick_params(axis='y', colors='tab:red')

ax2.set_ylim([1000, 1000000])

# Add legends for both plots
lines1, labels1 = ax1.get_legend_handles_labels()
lines2, labels2 = ax2.get_legend_handles_labels()
ax1.legend(lines1 + lines2, labels1 + labels2, loc='upper left', fontsize=18)

plt.title('Kahvilan liikevaihdon muutos seuraavan neljän vuoden aikana', fontsize=30)
fig.tight_layout()

fig, ax = plt.subplots()
table = ax.table(cellText=[["kvartaali"] + list(quarter), ["Myydyt tuotteet"] + list(buys_per_quarter), ["Liikevaihto"] + list(revenue_per_quarter)], loc='center', colWidths=[0.1 for i in range(0, len(["Liikevaihto"] + list(revenue_per_quarter)))])
table.auto_set_font_size(False)
ax.axis("off")
plt.show()