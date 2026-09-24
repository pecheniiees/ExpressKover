<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('service_requests', function (Blueprint $table) {
            $table->foreignId('courier_id')->nullable()->after('created_by')->constrained('users')->nullOnDelete();
            $table->decimal('latitude', 10, 7)->nullable()->after('address');
            $table->decimal('longitude', 10, 7)->nullable()->after('latitude');
            $table->unsignedInteger('queue_position')->nullable()->after('status');

            $table->index('courier_id');
            $table->index('queue_position');
            $table->index(['courier_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('service_requests', function (Blueprint $table) {
            $table->dropIndex(['courier_id', 'status']);
            $table->dropIndex(['queue_position']);
            $table->dropIndex(['courier_id']);
            $table->dropConstrainedForeignId('courier_id');
            $table->dropColumn(['latitude', 'longitude', 'queue_position']);
        });
    }
};
